import React, { useEffect, useState } from 'react'
import TestPagination from './TestPagination';

export default function Test2() {


    const  [ innerTest2 , setInnerTest2 ] = useState(3);

    const changeValue = ()=>{
        setInnerTest2(  innerTest2 + 1);
    }

    const fnGotoList = ( pPage ) =>{
        console.log("sdfasdfasdf")
        setInnerTest2(pPage)
    }

  return (
    <div>
        <button onClick={changeValue} >클릭</button>
        inner2 == {innerTest2}
      
      <TestPagination 
              nowPage={innerTest2}
              totalCount="100"
              gotoUrl="gototoot"
              searchWordList="djqtdma"
              fnGotoList={fnGotoList}
    />

<Test21 inner2={innerTest2} ></Test21>
    </div>
  )
}


export  function Test21(props) {

    const inner2 = props.inner2;

    const [ innerTest21 , setInnerTest21 ] = useState({ a : inner2 });

    useEffect(()=>{
        console.log("useEffect " + inner2 )
        setInnerTest21( { a : inner2 } )
    },[inner2])


  return (
    <div>
      asfasfasdf<br></br>
      {inner2}<br></br>
      {innerTest21.a}
      
    </div>
  )
}


