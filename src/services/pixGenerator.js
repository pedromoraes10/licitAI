// Gerador de Payload e QR Code Pix Oficial (Padrão Banco Central / EMVCo BR Code)

function formatEMV(id, value) {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

// Cálculo do CRC16-CCITT (Polinômio 0x1021)
function calcularCRC16(payload) {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= (payload.charCodeAt(i) << 8);
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Gera a string Pix Copia e Cola oficial do Banco Central
 * @param {Object} params
 * @param {string} params.chavePix - CPF, CNPJ, E-mail, Celular ou Chave Aleatória (EVP)
 * @param {string} params.nomeBeneficiario - Nome do titular da conta (até 25 caracteres)
 * @param {string} params.cidade - Cidade do titular (até 15 caracteres)
 * @param {number} params.valor - Valor em Reais (ex: 49.90)
 * @param {string} params.txid - Identificador da transação (até 25 caracteres alfanuméricos)
 */
export function gerarPixCopiaECola({
  chavePix = 'contato@licitai.com.br',
  nomeBeneficiario = 'LICITAI SAAS',
  cidade = 'SAO PAULO',
  valor = 49.90,
  txid = 'LICITAI'
}) {
  // Limpeza e truncamento de acordo com o padrão do BACEN
  let chaveLimpa = chavePix.trim();
  // Se for CNPJ (14 dígitos com ou sem pontuação), o Banco Central exige estritamente apenas números
  if (/\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}/.test(chaveLimpa) || /^\d{14}$/.test(chaveLimpa.replace(/\D/g, ''))) {
    chaveLimpa = chaveLimpa.replace(/\D/g, '');
  } else if (/\d{3}\.?\d{3}\.?\d{3}-?\d{2}/.test(chaveLimpa) || /^\d{11}$/.test(chaveLimpa.replace(/\D/g, ''))) {
    chaveLimpa = chaveLimpa.replace(/\D/g, '');
  }

  const nomeLimpo = nomeBeneficiario.normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 25).toUpperCase();
  const cidadeLimpa = cidade.normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 15).toUpperCase();
  const valorFormatado = Number(valor).toFixed(2);
  const txidLimpo = (txid || '***').replace(/[^a-zA-Z0-9]/g, '').slice(0, 25);

  // 00 - Payload Format Indicator (01)
  const f00 = formatEMV('00', '01');

  // 26 - Merchant Account Information (GUI: br.gov.bcb.pix + chave)
  const gui = formatEMV('00', 'br.gov.bcb.pix');
  const chave = formatEMV('01', chaveLimpa);
  const f26 = formatEMV('26', gui + chave);

  // 52 - Merchant Category Code (0000)
  const f52 = formatEMV('52', '0000');

  // 53 - Transaction Currency (986 = BRL)
  const f53 = formatEMV('53', '986');

  // 54 - Transaction Amount
  const f54 = formatEMV('54', valorFormatado);

  // 58 - Country Code (BR)
  const f58 = formatEMV('58', 'BR');

  // 59 - Merchant Name
  const f59 = formatEMV('59', nomeLimpo);

  // 60 - Merchant City
  const f60 = formatEMV('60', cidadeLimpa);

  // 62 - Additional Data Field Template (txid)
  const f62_05 = formatEMV('05', txidLimpo);
  const f62 = formatEMV('62', f62_05);

  // Montagem do payload parcial para cálculo do CRC16
  const payloadSemCRC = `${f00}${f26}${f52}${f53}${f54}${f58}${f59}${f60}${f62}6304`;
  const crc = calcularCRC16(payloadSemCRC);

  return `${payloadSemCRC}${crc}`;
}

export function gerarQrCodeUrl(payload, tamanho = 240) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${tamanho}x${tamanho}&margin=8&data=${encodeURIComponent(payload)}`;
}
