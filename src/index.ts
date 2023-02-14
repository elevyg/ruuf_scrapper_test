import axios from "axios"
import cheerio from "cheerio"
import cooperativa from "./scrappers/cooperativa"

const url = "https://www.cooperativa.cl" // URL we're scraping
const AxiosInstance = axios.create() // Create a new Axios Instance

const main = async () => {
  const subArticles = await cooperativa()
  console.log(subArticles)
}

main()
