import { useState, useEffect } from 'react'
import './App.css'

const API_KEY = ''

function App() {
  const [data, setData] = useState()
  const [totalGasUsed, setTotalGasUsed] = useState(0)
  const [loading, setLoading] = useState(true)
  const [txStatsList, setTxStatsList] = useState([])
  const [address, setAddress] = useState('')

  useEffect(() => {
    const script = document.createElement('script')

    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore.js'
    script.async = true

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  function fetchTransactions() {
    var url = `https://api.ftmscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${API_KEY}`
    var groupedTx = []
    let listOfTxStats = []
    fetch(url)
      .then((response) => response.json())
      .then((res) => {
        setData(res['result'])
      })
      .then((_) => {
        groupedTx = window._.groupBy(data, 'to')
        var uniqueAddresses = Object.keys(groupedTx)
        var totalGasUsed = 0

        uniqueAddresses.forEach((uniqueAddress) => {
          var temp = 0

          var arr = groupedTx[uniqueAddress]
          for (let index = 0; index < arr.length; index++) {
            temp += arr[index]['gasUsed'] * arr[index]['gasPrice']
          }
          totalGasUsed += temp
          var tempTxStat = {
            to: uniqueAddress,
            numberOfTimesInteracted: arr.length,
            gasUsed: temp / Math.pow(10, 18),
          }

          listOfTxStats.push(tempTxStat)
        })

        setTxStatsList(
          listOfTxStats.sort(
            (a, b) => b.numberOfTimesInteracted - a.numberOfTimesInteracted,
          ),
        )
        setTotalGasUsed(totalGasUsed / Math.pow(10, 18))

        if (data != null) setLoading(false)
      })
  }

  const handleSubmit = (event) => {
    if (address !== '') {
      console.log(`address = ${address}`)
      if (address?.length > 16) fetchTransactions(address)
    }
    event.preventDefault()
  }

  return (
    <div className="App">
      <ul>
        <li>
        <a href="#"><b> Where did my gas go?</b></a>
        </li>
      </ul>

      <br />
      <br />
      <div className="center">
        <form onSubmit={handleSubmit}>
          <label>
            Address:
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>

      {loading ? (
        <div>
          <br />
          <br />
          <h2 className="center">Stats to appear here...</h2>
        </div>
      ) : (
        <>
          <div className="center">
            <p>
              Interacted with <h3>{txStatsList.length}</h3> unique addresses and
              spent <h3>{totalGasUsed} </h3>FTM in gas
            </p>
            <br />
            <br />
          </div>
          <div>
            <table id="txs">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>No of times interacted</th>
                  <th>Gas Used</th>
                </tr>
              </thead>
              <tbody>
                {txStatsList.map((txStat) => (
                  <tr key={txStat.to}>
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
          </div>
        </>
      )}
    </div>
  )
}

export default App
