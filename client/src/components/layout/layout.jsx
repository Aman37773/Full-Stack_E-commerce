import { MdDescription } from "react-icons/md"
import Footer from "./footer"
import Header from "./header"
import {Helmet} from 'react-helmet' 
function Layout({description='default',keywords='default',author='default',children,title='default'}){
          return (<>
            <Helmet>
                <meta charSet="utf-8" />
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="author" content={author}/>
                <title>{title}</title>
            </Helmet>
          <Header/>
          <h1 style={{minHeight:'80vh'} }>{children}</h1>
          <Footer/>
          </>)
}
export default Layout