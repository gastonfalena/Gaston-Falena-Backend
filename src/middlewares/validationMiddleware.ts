import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";

export default function validationMiddleware(
  dtoClass: any,
  skipMissingProperties = false,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObj = plainToInstance(dtoClass, req.body);

    const errors = await validate(dtoObj, {
      skipMissingProperties,
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const formattedErrors = errors.map((error: ValidationError) => ({
        property: error.property,
        constraints: error.constraints,
      }));

      return res.status(400).json({
        message: "Validation failed",
        errors: formattedErrors,
      });
    }
    req.body = dtoObj;
    next();
  };
}
