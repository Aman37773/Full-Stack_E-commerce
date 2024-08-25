import Layout from "../components/layout/layout";
import contactimage from './contact_image.jpg'   //in react, firstly import the image to use.
import '../index.css'
import { SiGooglebigquery } from "react-icons/si";
import { MdOutlinePermPhoneMsg,MdMarkEmailUnread,MdOutlinePhoneMissed  } from "react-icons/md";
function Contact(){
          return <>
          <Layout>
          <div className="contact">
          <img src={contactimage} />
          <div className="contact-right">
                    <div className="banner">contact us</div>
                    <div className="query"><SiGooglebigquery /> &nbsp;we are available 24*7 for any query that you have and will resolve it effectively without any concerns</div>
                    <div className="help"><MdMarkEmailUnread /> &nbsp;www.helpdesk@ecommerce.com</div>
                    <div className="phone"><MdOutlinePermPhoneMsg /> &nbsp;98798-798687987</div>
                    <div className="toll-free"><MdOutlinePhoneMissed /> &nbsp;1800-000-000</div>
          </div>
          </div>
          

          </Layout>
          </>
}

export default Contact