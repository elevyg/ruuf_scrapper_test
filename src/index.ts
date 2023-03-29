import res from "./textDecorationChallengingResponse"

const shortenSpanishMonths = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
]

const TOLERANCE = 0.01

const main = () => {
  const parsedRes = res.TextDetections.filter((v) => v.Type === "WORD").map(
    (item) => ({
      value: item.DetectedText,
      left: item.Geometry.BoundingBox.Left,
      right: item.Geometry.BoundingBox.Left + item.Geometry.BoundingBox.Width,
    }),
  )

  const monthsPositions = parsedRes.filter((item) =>
    shortenSpanishMonths.includes(item.value),
  )

  const numbersPositions = parsedRes.filter(
    (item) => !shortenSpanishMonths.includes(item.value),
  )

  const valueForMonth = monthsPositions.map((month) => {
    const valueInTolerantPosition = numbersPositions.find(
      (item) =>
        item.left > month.left - TOLERANCE &&
        item.left < month.left + TOLERANCE &&
        item.right > month.right - TOLERANCE &&
        item.right < month.right + TOLERANCE,
    )

    const parsedValue = parseFloat(
      valueInTolerantPosition?.value.replace(".", "").replace(",", "."),
    )

    return {
      month: month.value,
      value: parsedValue || null,
    }
  })

  return valueForMonth
}

main()
