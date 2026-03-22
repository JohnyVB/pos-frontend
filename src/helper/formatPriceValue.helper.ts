export const formatPriceValue = (value: string | number) => {
  if (typeof value === "number") {
    value = value.toString()
  }
  const numValue = value.replace(",", ".")
  const regex = /^\d*(\.\d{0,3})?$/
  if (value === "" || regex.test(numValue)) {
    return value
  }
}