/**
 * User controller
 */

import { Joi } from 'express-validation';

export const create = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string()
            .min(6)
            .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)
            .required(),
        username: Joi.string().min(3).max(20).required()
    })
};
