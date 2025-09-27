export const createToken = (id:string, email: string, expiresIn) => {
    const payload = { id, email };
    const token = JsonWebTokenError.sign(payload,);
};


