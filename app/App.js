import React from 'react';
import styles from './App.css';
import axios from 'axios';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {test: 'foo', financeData:[],deviation:null};
  }

  componentWillMount() {
    var that = this;
    setInterval(function(){
        
        axios.get('/getFinanceData')
      .then(response => {
        console.log("res",response.data);
        var addPrice = 0, priceArr =[];

       // code to calculate standard deviation;
        response.data.forEach(function(dataItem){
          if(dataItem){
            priceArr.push(parseInt(dataItem.change))
            addPrice += parseInt(dataItem.change);
          }
        })


        var mean = addPrice/priceArr.length;
        var square = 0;
        for(var i=0;i<priceArr.length ;i++){
            square += Math.pow(priceArr[i] - mean,2)
        }

        that.state.deviation = Math.sqrt(square/(priceArr.length-1));
        that.setState({financeData:response.data,deviation:that.state.deviation})
      });

    },10000)
  

  }


  render() {
    return (
      <div className="container-fluid">
      <div className="row-fluid">Google Finance Live Data</div>
      <span><b>Standard Deviation : {this.state.deviation}</b></span>
        <table className="table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Price</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
         
          {this.state.financeData.map(function(data){
            if(data){
               return (<tr>
                      <td  dangerouslySetInnerHTML={{ __html: data.symbol }}  ></td>
                      <td>{data.price}</td>
                      <td className={parseInt(data.change) >= 0 ? "text-success": "text-danger" }>{data.change} {data.changePer}</td>
                      
                    </tr>)
            }
          })}
          
           
            </tbody>
        </table>

      </div>
    );
  }
}
