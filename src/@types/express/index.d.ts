/* eslint-disable @typescript-eslint/member-delimiter-style */
declare namespace Express {
  export interface Request {
    token?: any;
    currentUser?: any;
  }
  export interface Response {
    data?: {
      success: true | false;
      message?: string;
      error?: any;
      data?: any;
    };
  }
}
