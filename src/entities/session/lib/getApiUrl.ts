// Хост API у GREEN-API зависит от инстанса: первые 4 цифры idInstance
export const getApiUrl = (idInstance: string) =>
  `https://${idInstance.slice(0, 4)}.api.green-api.com`
