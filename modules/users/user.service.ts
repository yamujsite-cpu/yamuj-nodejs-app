import { compare, hash } from "bcryptjs";
import crypto from "crypto";
import expressAsyncHandler from "express-async-handler";
import jsonwebtoken from "jsonwebtoken";
import apiError from "../../utils/appError.js";
import {
  createDocument,
  deleteDocument,
  getAllDocuments,
  getSingleDocument,
  updateDocument,
} from "../../utils/handlersFactory.js";
import sendEmail from "../../utils/sendEmail.js";
import { FAIL, SUCCESS } from "../../utils/statusTexts.js";
import UserModel from "./userModel.js";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const createToken = (payload: any) => {
  const token = jsonwebtoken.sign(
    { id: payload },
    process.env.JWT_SECRET_KEY as any,
    {
      expiresIn: process.env.JWT_EXPIRE_TIME as any,
    },
  );

  return token;
};

/**
 * @description Protect routes
 */
export const protectRoutes = expressAsyncHandler(async (req, res, next) => {
  // Verify if token exits
  let token: string = "";

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1] as string;
  }

  if (!token) {
    return next(
      apiError.create("You are not allowed to access this resource", 401, FAIL),
    );
  }

  // Verify Token
  const decoded = jsonwebtoken.verify(
    token,
    process.env.JWT_SECRET_KEY as any,
  ) as any;

  // Check if user exists
  const currentUser = await UserModel.findById(decoded.id).select("+password");

  if (!currentUser) {
    return next(
      apiError.create(
        "The user that belong to this token is no longer exists",
        401,
        FAIL,
      ),
    );
  }

  // Check if password changed after token created
  // if (currentUser?.passwordChangedDate) {
  //   const passwordChangedTimestamp = parseInt(
  //     currentUser.passwordChangedDate.getTime() / 1000,
  //     10,
  //   );

  //   if (passwordChangedTimestamp > decoded.iat) {
  //     const error = new ApiError("Password has been changed.", 401);

  //     return next(error);
  //   }
  // }

  req.user = currentUser;

  next();
});

/**
 * @description roles
 */
export const allowedTo = (...roles: string[]) =>
  expressAsyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        apiError.create(
          "You are not allowed to access this resource.",
          403,
          FAIL,
        ),
      );
    }

    next();
  });

/**
 * @description get all users
 * @route GET /api/users
 * @access Private
 */
export const getAllUsers = getAllDocuments(UserModel);

/**
 * @description get single user by id
 * @route GET /api/users/:id
 * @access Private
 */
export const getSingleUser = getSingleDocument(UserModel);

/**
 * @description Create new user
 * @route POST /api/users
 * @access Private
 */
export const createNewUser = createDocument(UserModel);

/**
 * @description update user by id
 * @route PUT /api/users/:id
 * @access Private
 */
export const updateUser = updateDocument(UserModel);

/**
 * @description delete user by id
 * @route DELETE /api/users/:id
 * @access Private
 */
export const deleteUser = deleteDocument(UserModel);

/**
 * @description login user
 * @route POST /api/users/login
 * @access Private
 */
export const login = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(apiError.create("Email and password are required", 400, FAIL));
  }

  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    return next(apiError.create("User not found", 404, FAIL));
  }

  if (!user.isActive) {
    return next(apiError.create("User is not active", 403, FAIL));
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    return next(apiError.create("Invalid password", 401, FAIL));
  }

  const token = createToken(user._id);
  user.password = undefined as any;

  res.status(200).json({
    status: SUCCESS,
    message: "User logged in successfully",
    data: {
      user,
      token,
    },
  });
});

/**
 * @description Active/deactive user
 * @route POST /api/users/login
 * @access Private
 */
export const activeUser = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).select("+password");

  if (!user) {
    return next(apiError.create("User not found", 404, FAIL));
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      isActive: !user.isActive,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: SUCCESS,
    message: "User activated successfully",
    data: updatedUser,
  });
});

/**
 *@desc Get logged user data
 *@route GET:/api/users/my-data
 *@access private
 */
export const getLoggedUserData = expressAsyncHandler(
  async (req, __res, next) => {
    req.params.id = req.user._id;

    next();
  },
);

/**
 *@desc Update logged user password
 *@route PUT:/api/users/change-password
 *@access private
 */
export const changeLoggedUserPassword = expressAsyncHandler(
  async (req, res, next) => {
    const user = await UserModel.findById(req.user._id).select("+password");

    if (!user) {
      return next(apiError.create("User not found", 404, FAIL));
    }

    const isSamePassword = await compare(req.body.oldPassword, user.password);

    if (!isSamePassword) {
      return next(apiError.create("Old password is incorrect", 400, FAIL));
    }

    // Update user Password
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        password: await hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      },
    );

    // Generate Token
    const token = createToken(updatedUser?._id);

    res.status(200).json({
      data: updatedUser,
      token,
      message: "Password changed successfully",
    });
  },
);

/**
 *@desc Update logged user profile
 *@route PUT:/api/users/update-profile
 *@access private
 */

export const updateProfile = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).select("+password");

  if (!user) {
    return next(apiError.create("User not found", 404, FAIL));
  }

  const updateData: any = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.password) {
    if (!req.body.oldPassword) {
      return next(
        apiError.create(
          "Old password is required to change password",
          400,
          FAIL,
        ),
      );
    }
    const isSamePassword = await compare(req.body.oldPassword, user.password);

    if (!isSamePassword) {
      return next(apiError.create("Old password is incorrect", 400, FAIL));
    }
    updateData.password = await hash(req.body.password, 12);
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user._id,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: SUCCESS,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

/**
 *@desc Forget Password
 *@route GET:/api/auth/forget-password
 *@access public
 */

export const forgetPassword = expressAsyncHandler(async (req, res, next) => {
  const existedUser = await UserModel.findOne({
    email: req.body.email,
  });

  if (!existedUser) {
    return next(apiError.create("User not found", 404, FAIL));
  }

  const resetCode = Math.floor(Math.random() * 900000 + 100000).toString();

  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  existedUser.passwordResetCode = hashedResetCode;
  existedUser.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  existedUser.passwordResetVerified = false;

  await existedUser.save();





  try {
    await sendEmail({
      email: existedUser.email,
      subject: "Reset password code (valid for 10 min)",
      code:resetCode,
      name: existedUser.name,
    });

  } catch (error) {

    existedUser.passwordResetCode = undefined;
    existedUser.passwordResetExpires = undefined;
    existedUser.passwordResetVerified = undefined;

    await existedUser.save();

    return next(apiError.create("Internal Server Error", 500, FAIL));
  }

  console.log("7 - Sending response");

  res.status(200).json({
    status: "Success",
    message: "Reset code sent successfully",
  });
});
