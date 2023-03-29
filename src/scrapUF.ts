import axios from "axios"
import cheerio from "cheerio"

const url =
  "https://si3.bcentral.cl/indicadoressiete/secure/Serie.aspx?gcode=UF&param=RABmAFYAWQB3AGYAaQBuAEkALQAzADUAbgBNAGgAaAAkADUAVwBQAC4AbQBYADAARwBOAGUAYwBjACMAQQBaAHAARgBhAGcAUABTAGUAYwBsAEMAMQA0AE0AawBLAF8AdQBDACQASABzAG0AXwA2AHQAawBvAFcAZwBKAEwAegBzAF8AbgBMAHIAYgBDAC4ARQA3AFUAVwB4AFIAWQBhAEEAOABkAHkAZwAxAEEARAA%3d" // URL we're scraping
const AxiosInstance = axios.create() // Create a new Axios Instance

interface UFObject {
  date: Date
  value: number
}

type Result = UFObject[]

const main = async () => {
  const mainPage = await AxiosInstance.get(url)
  const $ = cheerio.load(mainPage.data)
  const result: Result = $(".obs")
    .toArray()
    .map((el) => {
      const arrayDate = $(el).attr("id")
      const formattedDate = arrayDate.replace("gr_ctl", "").split("_")
      const day = Number(formattedDate[0]) - 1
      const month = spanishMonthToNumber(arrayDate[1])

      const date = new Date(2023, month - 1, day)

      const textValue = $(el).text()
      const formattedValue = textValue.replace(".", "").replace(",", ".")
      const value = Number(formattedValue)

      return {
        value,
        date,
      }
    })
    .filter((v) => v.value !== 0)

  console.log(result)
}

main()

const spanishMonth = {
  enero: 1,
  febrero: 2,
  marzo: 3,
  abril: 4,
  mayo: 5,
  junio: 6,
  julio: 7,
  agosto: 8,
  septiembre: 9,
  octubre: 10,
  noviembre: 11,
  diciembre: 12,
}

const spanishMonthToNumber = (month: string): number => {
  try {
    const safeMonth = month.toLowerCase()
    const res = spanishMonth[safeMonth]
    return res
  } catch (error) {
    return 0
  }
}
