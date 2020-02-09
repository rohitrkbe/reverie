import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(){
    super();
    this.state={
      data: null,
      dataTableAllCheckboxCheck: false,
      selectedTableRows: [],
    }
  }

  componentDidMount(){
    fetch("https://jsonplaceholder.typicode.com/photos")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({ data: result });
      },
      (error) => {
        console.log('fetch error', error);
        this.setState({ data : 'error' });
      }
    )
  }

  handleRowClick = (rowData, rowIndex) => {
    console.log('onRow Click', rowData, rowIndex);
  }

  handleRowCheckboxClick = rowData => {
    let selectedRow= this.state.selectedTableRows;
    let rowDataPresent = false;
    for(let i=0; i<selectedRow.length; i++){
      if ( selectedRow[i].id === rowData.id ){
        selectedRow.splice(i,1);
        rowDataPresent = true;
      }
    }
    if ( !rowDataPresent ){
      selectedRow.push(rowData);
    }
    this.setState({ selectedTableRows: selectedRow });
  }

  handleDataTableAllCheckboxCheckClick = () => {
    let allData= this.state.data;
    if ( !this.state.dataTableAllCheckboxCheck ){
      this.setState ({ selectedTableRows: allData , dataTableAllCheckboxCheck: true })
    }else{
      this.setState ({ selectedTableRows: [] , dataTableAllCheckboxCheck: false })
    }
  }

  render(){
    const { data, dataTableAllCheckboxCheck } = this.state;
    console.log('render', this.state);
    if ( !data === null ){
      return(
        <div className="App">
          <p>Fetching data...</p>
        </div>
      )
    }else if ( !data === 'error' ){
      return(
        <div className="App">
          <p>Error in loading data !!!</p>
        </div>
      )
    }else {
      return (
        <div>
          <p>--- Table ---</p> 
          { 
            data && data.length > 0
            ? 
              <Table
                columns= {[
                  {id: 'albumNumber', label:'Album Number', numeric: true},
                  {id: 'title', label:'Title', numeric: false},
                  {id: 'thumbnail', label:'Thumbnail', numeric: false},
                  {id: 'url', label:'URL', numeric: false},
                  {id: 'click', label:'Click', numeric: false},
                ]} 
                row= { data }
                onRowClick= { (rowData, rowIndex) => this.handleRowClick(rowData, rowIndex) }
                dataTableAllCheckboxCheck = { dataTableAllCheckboxCheck }
                rowCheckboxClick= { (rowData) => this.handleRowCheckboxClick(rowData) }
                dataTableAllCheckboxCheckClick= { () => this.handleDataTableAllCheckboxCheckClick() }
              />       
            : null
          } 
        </div>
      );
    }
  }
}

export default App;

function Table({ columns={}, row={}, onRowClick, dataTableAllCheckboxCheck, dataTableAllCheckboxCheckClick, rowCheckboxClick }){
  console.log('props', row);
  return(
    <table className="DataTable" >
      <thead>
        <tr className="TableRow">
          <th className="TableHeader"><input type="checkbox" id="myCheck" checked= { dataTableAllCheckboxCheck } onChange={ () => dataTableAllCheckboxCheckClick() } onClick={ () => dataTableAllCheckboxCheckClick() } /></th>
          {
            columns.map((items, index)=>{
              return(
                <th className="TableHeader" key={'headlist'+index}>{items.label}</th>
              ) 
            })
          }
        </tr>
      </thead>
      <tbody>
        {
          row.map((items, index)=>{
            return(
              <tr className="TableRow" key={'list'+index} >
                {
                  dataTableAllCheckboxCheck
                  ?
                    <th><input type="checkbox" id="rowCheck" onClick={()=>rowCheckboxClick(items)} onChange={()=>rowCheckboxClick(items)} checked={dataTableAllCheckboxCheck}  /></th>
                  :
                    <th><input type="checkbox" id="rowCheck" onClick={()=>rowCheckboxClick(items)} onChange={()=>rowCheckboxClick(items)} /></th>
                }
                <th className="TableDataRight">{items.albumId}</th>
                <th className="TableData">{items.title}</th>
                <th className="TableData">{items.thumbnailUrl}</th>
                <th className="TableData">{items.url}</th>
                <th><button onClick={()=>onRowClick(items, index)}>Details</button></th>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
}