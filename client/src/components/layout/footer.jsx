import {Link} from 'react-router-dom'   //link is treated as a(anchor tag) in css
import '../../index.css'
function Footer(){
          return <>
        <div className="footer">
          <h1 className="text-center">ALL RIGHTS RESERVED</h1>
          <p className="text-center mt-3">
                    <Link to='/about'>about</Link>|
                    <Link to='/contact'>contact</Link>|
                    <Link to='/policy'>privacy policy</Link>
          </p>
        </div>
          </>
}
export default Footer