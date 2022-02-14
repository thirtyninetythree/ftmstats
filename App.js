import { useState, useEffect } from 'react'
import './App.css'

const API_KEY = 'YNSPXNVMMYGY5URIB2I76YY5FQPCPWFJCN'
const user_address = '0x8f147D02251FBF1E5912fC8b29F1E620fc9A5e1b'
var url = `https://api.ftmscan.com/api?module=account&action=txlist&address=${user_address}&startblock=0&endblock=99999999&sort=asc&apikey=${API_KEY}`
function App() {
  const [data, setData] = useState()
  const [totalGasUsed, setTotalGasUsed] = useState(0)
  const [loading, setLoading] = useState(true)
  const [txStatsList, setTxStatsList] = useState([])
  // const [chartState, setChartState] = useState()

  useEffect(() => {
    const script = document.createElement('script');
    
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore.js"
    script.async = true;
  
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    }
  }, []);
  
  function fetchTransactions() {
    var groupedTx = [];
    let listOfTxStats =[]
    fetch(url)
      .then((response) => response.json())
      .then((res) => { setData(res["result"])})
      .then((_) => {
        groupedTx = window._.groupBy(data, 'to')
        var uniqueAddresses = Object.keys(groupedTx)
        var totalGasUsed = 0;

        uniqueAddresses.forEach((uniqueAddress) => {
          var temp = 0;
          
          var arr = groupedTx[uniqueAddress];
          for (let index = 0; index < arr.length ; index++ ) {
            temp += arr[index]["gasUsed"] * arr[index]["gasPrice"] 
          }
          totalGasUsed += temp;
          var tempTxStat = {
          to: uniqueAddress,
          numberOfTimesInteracted: arr.length,
          gasUsed: temp / Math.pow(10,18) 
          }
        
          listOfTxStats.push(tempTxStat);
        });
        setTxStatsList(listOfTxStats)
        setTotalGasUsed(totalGasUsed / Math.pow(10,18))
      
        if (data != null)
        setLoading(false)
      }) 
  }

  return (
    <div className="App">
      <button onClick={fetchTransactions}>PRESS</button>
      <br/>
      <br/>
      
      {loading ?  
      <p>loading....</p> :
      <div>
         Interacted with {txStatsList.length} unique addresses and spent {totalGasUsed} FTM in gas

        <br/>
        <br/>

        <table id ="txs">
          <tr>
            <th>Address</th>
            <th>No of times interacted</th>
            <th>Gas Used</th>
          </tr>
          <tbody>
            {
           
           txStatsList.map((txStat) => (
             
              <tr>
                <td>{txStat.to}</td>
                <td>{txStat.numberOfTimesInteracted}</td>
                <td>{txStat.gasUsed} FTM</td>
               
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
            <td>TOTALS</td>
            <td>{data.length}</td>
            <td>{totalGasUsed} FTM</td>
            </tr>
          </tfoot>
  </table>
      </div> } 
    </div>
  )
}

export default App
