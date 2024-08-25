import Layout from "../components/layout/layout";
import about from './about.jpg'
import '../index.css'
function About(){
          return <>
          <Layout description={'its about our app'} keywords={'about, products,demand'} title={'about-Ecommerce'} author={'apes'}>
                    <div className="about ">
                    <img src={about}></img>
                    <div className="about-con">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nulla cum ducimus cumque aliquam. Provident eveniet repellendus quod ipsum iste, fugiat magnam ad tenetur molestiae aliquid ipsam laboriosam excepturi sed saepe.</div>
                    </div>
          </Layout>
          </>
}

export default About