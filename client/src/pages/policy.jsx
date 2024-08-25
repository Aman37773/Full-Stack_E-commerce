import Layout from "../components/layout/layout";
import policy from './privacy.jpg'
import '../index.css'
function Policy(){
          return <>
          <Layout>
                    <div className="policy">
                    <img src={policy}></img>
                    <div className="policy-con">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quaerat tempore animi vel modi ea quasi ipsa velit iusto unde, perspiciatis cumque optio labore adipisci praesentium nihil magni molestiae ab quos obcaecati magnam pariatur recusandae earum! Qui sapiente sed corrupti! Nulla!</div>
                    </div>
          </Layout>
          </>
}

export default Policy