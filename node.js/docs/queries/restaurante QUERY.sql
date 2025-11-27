# CRIANDO O restauranteInfoByID
# Juntar as formas_pagamento em uma única linha
SELECT 
    r.*,
    GROUP_CONCAT(p.nome ORDER BY p.nome SEPARATOR ', ') AS formas_pagamento
FROM 
    restaurante r
LEFT JOIN 
    restaurante_pagamento rp ON r.id = rp.idRestaurante
LEFT JOIN 
    pagamento p ON rp.idPagamento = p.id
GROUP BY 
    r.id
ORDER BY 
    r.id;
    
# Juntar as formas_pagamento em uma única linha
SELECT 
 r.*,
    GROUP_CONCAT(p.nome ORDER BY p.nome SEPARATOR ', ') AS formas_pagamento
FROM 
    restaurante r
LEFT JOIN 
    restaurante_pagamento rp ON r.id = rp.idRestaurante
LEFT JOIN 
    pagamento p ON rp.idPagamento = p.id
WHERE 
    r.id = 1  -- Substitua pelo ID desejado
ORDER BY 
    p.nome;
    
# Tabela com formas_pagamento e tipos_cozinha
SELECT 
    r.*,
    GROUP_CONCAT(DISTINCT p.nome ORDER BY p.nome SEPARATOR ', ') AS formas_pagamento,
    GROUP_CONCAT(DISTINCT tc.nome ORDER BY tc.nome SEPARATOR ', ') AS tipos_cozinha
FROM 
    restaurante r
LEFT JOIN 
    restaurante_pagamento rp ON r.id = rp.idRestaurante
LEFT JOIN 
    pagamento p ON rp.idPagamento = p.id
LEFT JOIN 
    restaurante_tipo_cozinha rtc ON r.id = rtc.idRestaurante
LEFT JOIN 
    tipo_cozinha tc ON rtc.idTipoCozinha = tc.id
GROUP BY 
    r.id
ORDER BY 
    r.id;
    
# tabela com formas_pagamento, tipos_cozinha e horarios_funcionamento
SELECT 
    r.*,
    GROUP_CONCAT(DISTINCT p.nome ORDER BY p.nome SEPARATOR ', ') AS formas_pagamento,
    GROUP_CONCAT(DISTINCT tc.nome ORDER BY tc.nome SEPARATOR ', ') AS tipos_cozinha,
    GROUP_CONCAT(
        DISTINCT CONCAT(
            hf.diaSemana, ': ', 
            hf.horaAbertura, ' - ', 
            hf.horaFechamento
        ) 
        ORDER BY hf.diaSemana 
        SEPARATOR ' | '
    ) AS horarios_funcionamento
FROM 
    restaurante r
LEFT JOIN 
    restaurante_pagamento rp ON r.id = rp.idRestaurante
LEFT JOIN 
    pagamento p ON rp.idPagamento = p.id
LEFT JOIN 
    restaurante_tipo_cozinha rtc ON r.id = rtc.idRestaurante
LEFT JOIN 
    tipo_cozinha tc ON rtc.idTipoCozinha = tc.id
LEFT JOIN 
    horario_funcionamento hf ON r.id = hf.idRestaurante
WHERE 
    r.id = 1  -- Substitua pelo ID desejado ou remova esta linha para listar todos
GROUP BY 
    r.id
ORDER BY 
    r.id;