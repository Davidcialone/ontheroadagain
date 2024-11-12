import Joi from 'joi';
import emailValidator from 'email-validator';

const passwordSecurity = Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
    .required()
    .messages({
        'string.pattern.base': 'Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial.',
        'any.required': 'Le champ password est requis.'
    });

export default Joi.object({
    email: Joi.string().required()
        .custom((value, helpers) => {
        if (!emailValidator.validate(value)) {
            return helpers.error('any.invalid');
        }
        return value;
         })
        .messages({
            'string.email': 'Le champ email doit être une adresse email valide.',
            'any.required': 'Le champ email est requis.'
        }),
    lastname: Joi.string().required()
        .messages({
            'any.required': 'Le champ Nom est requis.'
        }),
    firstname: Joi.string().required()
        .messages({
            'any.required': 'Le champ Prénom est requis.'
        }),
    pseudo: Joi.string().optional(),
    password: passwordSecurity,
    confirmation: Joi.string().required()
        .valid(Joi.ref('password'))
        .messages({
        'any.only': 'La confirmation doit être identique au mot de passe.',
        'any.required': 'Le champ confirmation est requis.'
    })
});