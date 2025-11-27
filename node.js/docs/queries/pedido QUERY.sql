# MetodoPagamento, entregador e endereço completo
SELECT 
    p.id,
    clnt.nome AS nomeCliente,
    p.status,
    pag.nome AS metodoPagamento,
    p.avaliacao,
    p.estrelas,
    p.precoPedido,
    entr.nome AS entregador,
    rest.nome AS restaurante,
    p.inicioPedido,
    p.fimPedido,
    CONCAT_WS(', ', 
        end.logradouro, 
        end.numero, 
        end.complemento, 
        end.bairro, 
        end.cidade, 
        end.estado, 
        end.cep
    ) AS enderecoCompleto,
    end.referencia AS referenciaEndereco
FROM pedido p
INNER JOIN cliente clnt ON p.idCliente = clnt.id
INNER JOIN pagamento pag ON p.idPagamento = pag.id
INNER JOIN entregador entr ON p.idEntregador = entr.id
INNER JOIN restaurante rest ON p.idRestaurante = rest.id
INNER JOIN endereco end ON p.idEnderecoCliente = end.id
WHERE p.id = 3;
