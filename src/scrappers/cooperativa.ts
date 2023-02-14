import axios from "axios"
import cheerio from "cheerio"

const url = "https://www.cooperativa.cl"
const AxiosInstance = axios.create()

const cooperativa = async () => {
  try {
    const landing = await AxiosInstance.get(url)
    const html = landing.data
    const $ = cheerio.load(html)
    const viewMore = $("#a5").find("a:contains('Ver más')").attr("href")

    const viewMoreUrl = await AxiosInstance.get(viewMore)
    const root = cheerio.load(viewMoreUrl.data)
    const articles = root(".titular-noticia")
      .toArray()
      .map((el) => {
        return {
          title: root(el).text().trim(),
          href: root(el).parent().attr("href"),
        }
      })

    const subArticles = await Promise.all(
      articles.map(async (article) => {
        const articleUrl = await AxiosInstance.get(url + article.href)
        const loadArticle = cheerio.load(articleUrl.data)

        const topics = loadArticle(".rotulo-topicos")
          .find("a")
          .toArray()
          .map((el) => {
            return loadArticle(el).text().replace("| ", "")
          })
        const title = loadArticle("h1")
          .toArray()
          .map((el) => {
            return loadArticle(el).text()
          })
        const publishedDate = loadArticle(".fecha-publicacion")
          .find("time")
          .toArray()
          .map((el) => loadArticle(el).text())
        const author = loadArticle(".contenedor-datos:contains('Autor')")
          .find("span")
          .toArray()
          .map((el) => loadArticle(el).text())
        return { topics, title, publishedDate, author, url: url + article.href }
      }),
    )

    return subArticles
  } catch (error) {
    console.log(error)
  }
}

export default cooperativa
