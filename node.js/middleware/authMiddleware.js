const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Pegar token do header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token não fornecido"
      });
    }

    // Formato esperado: "Bearer TOKEN"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: "Formato de token inválido"
      });
    }

    const token = parts[1];

    // Verificar token
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Token inválido ou expirado"
        });
      }

      // Adicionar dados do usuário à requisição
      req.userId = decoded.id;
      req.username = decoded.username;
      
      next();
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao validar token"
    });
  }
};

module.exports = authMiddleware;