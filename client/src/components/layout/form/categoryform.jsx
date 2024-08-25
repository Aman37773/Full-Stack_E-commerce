function Categoryform({value,setvalue,handlesubmit}){
          return <>
           <form onSubmit={handlesubmit}>
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="enter new category" value={value} onChange={(el)=>setvalue(el.target.value)}/>
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
          </>
}
export default Categoryform