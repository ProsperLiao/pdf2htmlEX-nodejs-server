/**
 * @swagger
 *
 * components:
 *   schemas:
 *     LoginUser:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - username
 *         - password
 *
 *     NewUser:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *         desc:
 *           type: string
 *       required:
 *         - username
 *         - password
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         desc:
 *           type: string
 *         role:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *
 *     Token:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         expiresIn:
 *           type: string
 *
 *     Conversion:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         originFileName:
 *           type: string
 *         originFileSize:
 *           type: string
 *         filePath:
 *           type: string
 *         convertedFilePath:
 *           type: string
 *         zipFilePath:
 *           type: string
 *         splitPages:
 *           type: boolean
 *         status:
 *           type: string
 *         current:
 *           type: integer
 *         total:
 *           type: integer
 *         convertDuration:
 *           type: number
 *         creator_id:
 *           type: number
 *         creator_username:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */
