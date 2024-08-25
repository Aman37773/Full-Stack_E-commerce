import { Link } from "react-router-dom";
import Layout from "../components/layout/layout";
import getcategories from "./usecategories"
function Categories(){
const categories=getcategories();
          return(<>
          <Layout title='All Categories'>
          <div className="container">
          <div className="row">
          <div className="col-md-6">
          {categories &&  categories.map((el)=>
        <div className="col-md-6 mt-5 mb-3 gx-3 gy-3" key={el._id}>  
          <Link className="btn btn-primary" to={`/categories/${el._id}`}>
            {el.name}
          </Link>
        </div>
          )}
          </div>
          </div>
          </div>
</Layout>
           </>)
          
}
export default Categories