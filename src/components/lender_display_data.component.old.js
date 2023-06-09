import React, {Component} from 'react';
import axios from 'axios';
import { Modal, Row, Col, Button, Form} from "react-bootstrap";
import {Link} from 'react-router-dom'
import {Helmet} from 'react-helmet';

require('dotenv').config()

export default class DisplayData extends Component {
    constructor(props) {
        super(props);
        this.onSendEmails = this.onSendEmails.bind(this);
        this.onHideEmails = this.onHideEmails.bind(this);
        this.onSendPhone = this.onSendPhone.bind(this);
        this.onHidePhone = this.onHidePhone.bind(this);
        this.onSendEdit = this.onSendEdit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onHideEdit = this.onHideEdit.bind(this);
        this.copyText = this.copyText.bind(this);
        this.checkedBox = this.checkedBox.bind(this);
        this.onChangeRegion = this.onChangeRegion.bind(this);
        this.onChangeLender = this.onChangeLender.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeContact= this.onChangeContact.bind(this);
        this.onChangeInterestRange = this.onChangeInterestRange.bind(this);
        this.onChangePhoneNum = this.onChangePhoneNum.bind(this);
        this.onChangeMinCredScore = this.onChangeMinCredScore.bind(this);
        this.onChangeMaxLTV = this.onChangeMaxLTV.bind(this);
        this.onChangeMaxLoanAmt = this.onChangeMaxLoanAmt.bind(this);
        this.onChangeMaxAmort = this.onChangeMaxAmort.bind(this);
        this.onChangeNotes = this.onChangeNotes.bind(this);
        this.getData = this.getData.bind(this);
        this.onSearchAgain = this.onSearchAgain.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeLoanType = this.onChangeLoanType.bind(this);

        this.state = {
            data: [[]],
            noData: false,
            recieved: false,
            updated: false,
            showEmails: false,
            showPhone: false,
            copyText: "",
            showEdit: false,
            _id: "",
            region: "",
            lender: '',
            email: '',
            contact: '',
            phoneNum: '',
            interestRange: '',
            minCredScore: '',
            maxLTV: '',
            maxAmort: '',
            maxLoanAmt: '',
            notes: '',
            itemLoanTypes: [], 
            displayLoanTypes: [],
            loanTypes: [],
            loanTypeList: ''
            
        }
       
    }
    componentDidMount() {
        axios.get(`${process.env.REACT_APP_BACKEND_URI}/loanTypes/distinctLoanTypes`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
        .then(response => {
            if(response.data.length > 0) {
                this.setState({
                    loanTypes : response.data
                })
            }  
        })
        .catch((error) => {
            console.log(error);
        })

        console.log(this.props.match.params.region);
        console.log(this.props.match.params.loanTypes);
        const loanTypesArr = this.props.match.params.loanTypes.split(" ")
        var loanTypes = "";
        for(var i =0; i<loanTypesArr.length-1; i++) {
            loanTypes += loanTypesArr[i] + "%20";
        }
        loanTypes += loanTypesArr[loanTypesArr.length-1];
        console.log(this.props.match.params.loanTypes)
        if(this.props.match.params.lender === "View" && this.props.match.params.region==="All" && this.props.match.params.loanTypes==="Data") {
            axios.get(`${process.env.REACT_APP_BACKEND_URI}/lenderData/getAll`, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            .then(response =>  {
                this.setState({
                    recieved: true,
                    data: response.data.map(item => [item.lender, item.region, item.email, item.contact, item.phone, item.interestRange, item.minCreditScore, item.maxLTV, item.maxAmortization, item.maxLoanAmount, item.notes, item.loanType, item._id.toString()])
                })
            })
        }
        else if(this.props.match.params.lender != "None") {
            axios.get(`${process.env.REACT_APP_BACKEND_URI}/lenderData/getLenderName/`+this.props.match.params.lender, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            .then(response =>  {
                this.setState({
                    recieved: true,
                    data: response.data.map(item => [item.lender, item.region, item.email, item.contact, item.phone, item.interestRange, item.minCreditScore, item.maxLTV, item.maxAmortization, item.maxLoanAmount, item.notes, item.loanType, item._id.toString()])
                })
            })
            console.log("lender...")
            console.log(this.state.data)
        }
        else if(this.props.match.params.loanTypes==="None-") {
            
            axios.get(`${process.env.REACT_APP_BACKEND_URI}/lenderData/get/`+this.props.match.params.region, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            .then(response => {
                if(response.data.length > 0) {
                    this.setState({
                        recieved: true,
                        data : response.data.map(item => [item.lender, item.region, item.email, item.contact, item.phone, item.interestRange, item.minCreditScore, item.maxLTV, item.maxAmortization, item.maxLoanAmount, item.notes, item.loanType, item._id.toString()])
                    })
                    console.log(this.state.data[0])
                }
                else {
                    
                    console.log("no data");
                    this.setState({
                        noData: true
                    })
                }
                
            })
            .catch((error) => {
                console.log(error);
            })
        }
        else if(this.props.match.params.region ==="None"){
           
            console.log(loanTypes)
            axios.get(`${process.env.REACT_APP_BACKEND_URI}/lenderData/loanTypes/`+loanTypes, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            .then(response => {
                if(response.data.length > 0) {
                    this.setState({
                        recieved: true,
                        data : response.data.map(item => [item.lender, item.region, item.email, item.contact, item.phone, item.interestRange, item.minCreditScore, item.maxLTV, item.maxAmortization, item.maxLoanAmount, item.notes, item.loanType, item._id.toString()])
                    })
                    console.log(this.state.data[0])
                }
                else {
                    console.log("no data");
                    this.setState({
                        noData: true
                    })
                }
                
            })
            .catch((error) => {
                console.log(error);
            })
            
        }
        else {
            axios.get(`${process.env.REACT_APP_BACKEND_URI}/lenderData/get/`+loanTypes+"/"+this.props.match.params.region, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            .then(response => {
                if(response.data.length > 0) {
                    this.setState({
                        recieved: true,
                        data : response.data.map(item => [item.lender, item.region, item.email, item.contact, item.phone, item.interestRange, item.minCreditScore, item.maxLTV, item.maxAmortization, item.maxLoanAmount, item.notes, item.loanType, item._id.toString()])
                    })
                    console.log(this.state.data[0])
                }
                else {
                    console.log("no data");
                    this.setState({
                        noData: true
                    })
                }
                
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }
    onChangeRegion(e)
    {
        this.setState({
            region: e.target.value
        });
    }
    onChangeLender(e)
    {
        this.setState({
            lender: e.target.value
        });
    }
    onChangeEmail(e)
    {
        this.setState({
            email: e.target.value
        });
    }
    onChangeContact(e)
    {
        this.setState({
            contact: e.target.value
        });
    }
    onChangePhoneNum(e)
    {
        this.setState({
            phoneNum: e.target.value
        });
    }
    onChangeInterestRange(e)
    {
        this.setState({
            interestRange: e.target.value
        });
    }
    onChangeMinCredScore(e)
    {
        this.setState({
            minCredScore: e.target.value
        });
    }
    onChangeMaxLTV(e)
    {
        this.setState({
            maxLTV: e.target.value
        });
    }
    onChangeMaxAmort(e)
    {
        this.setState({
            maxAmort: e.target.value
        });
    }
    onChangeMaxLoanAmt(e)
    {
        this.setState({
            maxLoanAmt: e.target.value
        });
    }
    onChangeNotes(e)
    {
        this.setState({
            notes: e.target.value
        });
    }
    onSendEmails(e) {
        e.preventDefault();
        this.setState({
            showEmails:true
        });
    }
    onHideEmails(e) {
        e.preventDefault();
        this.setState({
            showEmails:false
        });
    }
    onSendPhone(e) {
        e.preventDefault();
        this.setState({
            showPhone:true
        });
    }
    onHidePhone(e) {
        e.preventDefault();
        this.setState({
            showPhone:false
        });
    }
    onHideEdit(e) {
        e.preventDefault();
        this.setState({
            showEdit:false,
            loanTypeList: ''
        });
    }
    onSearchAgain(e) {
        e.preventDefault();
        window.close();
        // this.forceUpdate()
    }    
    onSendEdit(item) {
        
        var loanTypes = item[11];
        const other = this.state.loanTypes;
        loanTypes.forEach(element => {
            this.state.loanTypeList += element + '-';
            var index = other.indexOf(element);
            if (index !== -1) {
                other.splice(index, 1);
            }
        });
        console.log(item[11]);
        this.setState({
            showEdit:true,
            _id : item[12],
            region: item[1],
            lender: item[0],
            email: item[2],
            contact: item[3],
            phoneNum: item[4],
            interestRange: item[5],
            minCredScore: item[6],
            maxLTV: item[7],
            maxAmort: item[8],
            maxLoanAmt: item[9],
            notes: item[10],
            itemLoanTypes: item[11],
            displayLoanTypes: other
        });


    }
    getData() {
        const loanTypesArr = this.props.match.params.loanTypes.split(" ")
        var loanTypes = "";
        for(var i =0; i<loanTypesArr.length-1; i++) {
            loanTypes += loanTypesArr[i] + "%20";
        }
        loanTypes += loanTypesArr[loanTypesArr.length-1];
        console.log(this.props.match.params.lender)
        if(this.props.match.params.lender === "View" && this.props.match.params.region==="All" && this.props.match.params.loanTypes==="Data") {
            axios.get(`${process.env.REACT_APP_BACKEND_URI}/lenderData/getAll`, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            .then(response =>  {
                this.setState({
                    recieved: true,
                    data: response.data.map(item => [item.lender, item.region, item.email, item.contact, item.phone, item.interestRange, item.minCreditScore, item.maxLTV, item.maxAmortization, item.maxLoanAmount, item.notes, item.loanType, item._id.toString()])
                })
            })
        }
        else if(this.props.match.params.lender != "None") {
            axios.get(`${process.env.REACT_APP_BACKEND_URI}/lenderData/getLenderName/`+this.props.match.params.lender, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            .then(response =>  {
                this.setState({
                    recieved: true,
                    data: response.data.map(item => [item.lender, item.region, item.email, item.contact, item.phone, item.interestRange, item.minCreditScore, item.maxLTV, item.maxAmortization, item.maxLoanAmount, item.notes, item.loanType, item._id.toString()])
                })
            })
            console.log("lender...")
            console.log(this.state.data)
        }
        else if(this.props.match.params.loanTypes==="None-") {
            
            axios.get(`${process.env.REACT_APP_BACKEND_URI}/lenderData/get/`+this.props.match.params.region, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            .then(response => {
                if(response.data.length > 0) {
                    this.setState({
                        recieved: true,
                        data : response.data.map(item => [item.lender, item.region, item.email, item.contact, item.phone, item.interestRange, item.minCreditScore, item.maxLTV, item.maxAmortization, item.maxLoanAmount, item.notes, item.loanType, item._id.toString()])
                    })
                    console.log(this.state.data[0])
                }
                else {
                    
                    console.log("no data");
                    this.setState({
                        noData: true
                    })
                }
                
            })
            .catch((error) => {
                console.log(error);
            })
        }
        else if(this.props.match.params.region==="None"){
           
            console.log(loanTypes)
            axios.get(`${process.env.REACT_APP_BACKEND_URI}/lenderData/loanTypes/`+loanTypes, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            .then(response => {
                if(response.data.length > 0) {
                    this.setState({
                        recieved: true,
                        data : response.data.map(item => [item.lender, item.region, item.email, item.contact, item.phone, item.interestRange, item.minCreditScore, item.maxLTV, item.maxAmortization, item.maxLoanAmount, item.notes, item.loanType, item._id.toString()])
                    })
                    console.log(this.state.data[0])
                }
                else {
                    console.log("no data");
                    this.setState({
                        noData: true
                    })
                }
                
            })
            .catch((error) => {
                console.log(error);
            })
        }
        else {
            console.log(loanTypes)
            axios.get(`${process.env.REACT_APP_BACKEND_URI}/lenderData/get/`+loanTypes+"/"+this.props.match.params.region, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            .then(response => {
                if(response.data.length > 0) {
                    this.setState({
                        recieved: true,
                        data : response.data.map(item => [item.lender, item.region, item.email, item.contact, item.phone, item.interestRange, item.minCreditScore, item.maxLTV, item.maxAmortization, item.maxLoanAmount, item.notes, item.loanType, item._id.toString()])
                    })
                    console.log("data")
                }
                else {
                    console.log("no data");
                    this.setState({
                        noData: true
                    })
                }
                
            })
            .catch((error) => {
                console.log(error);
            })
        }
            
    }
    onDelete() {
        axios.delete(`${process.env.REACT_APP_BACKEND_URI}/lenderData/delete/` + this.state._id, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
                .then(res => {
                        console.log(res.data)
                        this.setState({update:true});
                    });
        this.setState({
            showEdit:false,
            region: "",
            lender: '',
            email: '',
            contact: '',
            phoneNum: '',
            interestRange: '',
            minCredScore: '',
            maxLTV: '',
            maxAmort: '',
            maxLoanAmt: '',
            notes: '',
            recieved: false
        });
        setTimeout(() => this.getData(), 1000);
    }
    onChangeLoanType(e){
        if(e.target.checked) {
            this.state.loanTypeList += e.target.value + '-';
        }
        else {
            var length = e.target.value.length;
            var index = this.state.loanTypeList.indexOf(e.target.value)
            if(index != -1){
                this.state.loanTypeList = this.state.loanTypeList.substring(0,index) + this.state.loanTypeList.substring(index+length+1);
                console.log("removed " + index + " " + this.state.loanTypeList.substring(0,index))
            }
        }
        console.log(this.state.loanTypeList)
    }
    onSubmit(e) {
        e.preventDefault();
        const selectedLoans = this.state.loanTypeList.split("-");
        selectedLoans.splice(-1);
        console.log(selectedLoans);
        selectedLoans.forEach((item) => {
            if(item === "") {
                console.log(item);
                var index = selectedLoans.indexOf(item);
                selectedLoans.splice(index, 1);
            }
        })
        
        console.log(selectedLoans)
        const lenderData = {
            region: this.state.region,
            lender: this.state.lender,
            email: this.state.email,
            contact: this.state.contact,
            phoneNum: this.state.phoneNum,
            interestRange: this.state.interestRange,
            minCredScore: this.state.minCredScore,
            maxLTV: this.state.maxLTV,
            maxAmort: this.state.maxAmort,
            maxLoanAmt: this.state.maxLoanAmt,
            notes: this.state.notes,
            loanTypes: selectedLoans
        }
        axios.post(`${process.env.REACT_APP_BACKEND_URI}/lenderData/update/` + this.state._id, lenderData, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
                .then(res => console.log(res.data));
        this.setState({
            showEdit:false,
            region: "",
            lender: '',
            email: '',
            contact: '',
            phoneNum: '',
            interestRange: '',
            minCredScore: '',
            maxLTV: '',
            maxAmort: '',
            maxLoanAmt: '',
            notes: '',
            itemLoanTypes: [], 
            displayLoanTypes: [],
            loanTypeList: '',
            recieved: false
        });
        setTimeout(() => this.getData(), 1000);
        
      }
        
    copyText() {
        navigator.clipboard.writeText(this.state.copyText).then( () => {
            alert("Copied text:\n" + this.state.copyText)
        });
       
        
    }
    checkedBox(e){
        if(e.target.checked) {
            this.state.copyText += e.target.value + " ";
        }
        else {
            var length = e.target.value.length;
            var index = this.state.copyText.indexOf(e.target.value)
            if(index != -1){
                this.state.copyText = this.state.copyText.substring(0,index) + this.state.copyText.substring(index+length+1);
                console.log("removed " + index + " " + this.state.copyText.substring(0,index))
            }
        }
    }
    render() {
        // var emails = this.state.data.map(item => item[2]);
        if(this.state.recieved) {
            return (
              
                    <div style = {{  padding: 50, color:'white'}}>
                          <Helmet>
                            <style>{'body { background-color: rgb(30,19,67); }'}</style>
                         </Helmet>
                    <div  >
                        <div style = {{textAlign:"left"}}>
                            <strong>Search Results for:  </strong> 
                            <br></br>
                            Lender: <strong> {this.props.match.params.lender} </strong>
                            <br></br>
                            Loan Types: <strong>{this.props.match.params.loanTypes.substring(0,this.props.match.params.loanTypes.length-1).replaceAll("-", ", ")} </strong>
                            <br></br>
                            Region: <strong>{this.props.match.params.region}</strong> 
                        </div>
                        <Link to="/queryData" className="btn btn-secondary btn-lg btn-block" role="button"> Search Again</Link>
                        
                        {/* <Container > */}
                           
                            <button  style = {{float:'left'}} onClick= {this.copyText} type="button" class="btn btn-light btn-lg btn-block">Copy Selected</button>
                            <button  style = {{float:'right'}} onClick = {this.onSendEmails} type="button" class="btn btn-dark btn-lg btn-block">View Emails</button>   
                            <button  style = {{float:'right'}} onClick = {this.onSendPhone} type="button" class="btn btn-light btn-lg btn-block">View Phone Numbers</button>   
                            <br></br>
                            <div style={{paddingTop:50, }} > 
                                <Row >
                                    <Col sm={12}>
                                        <table class="table" style= {{"borderWidth":"1px", 'borderColor':"#aaaaaa", color:'white'}} >
                                            <thead>
                                                <tr>
                                                    <th scope="col">Lender</th>
                                                    <th scope="col">Region</th>
                                                    <th scope='col'> Contact </th>
                                                    <th scope='col'> Email </th>
                                                    <th scope='col'> Phone Number </th>
                                                    <th scope="col"> Interest Range </th>
                                                    <th scope="col"> Minimum Credit Score </th>
                                                    <th scope="col">Max LTV</th>
                                                    <th scope='col'> Max Amortization (years)</th>
                                                    <th scope='col'> Max Loan Amount</th>
                                                    <th scope='col'> Loan Types</th>
                                                    <th scope="col">Notes</th>
                                                    {/* <th scope="col">Loan Types</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                this.state.data.map( item => (
                                                <tr>
                                                    <td style = {{'width':'100px'}}>
                                                            {item[0] === ""  ?  "None" : item[0]}
                                                    </td>
                                                    <td>
                                                            {item[1] === "" || item[1] === "-" ?  "None" : item[1]}
                                                    </td>
                                                    <td>
                                                            {item[3] === ""  ?  "None" : item[3]}
                                                    </td>
                                                    <td style = {{width:'100px'}}>
                                                        {item[2] === ""  ?  "None" : 
                                                            <div>
                                                                <input
                                                                    inline
                                                                    value = {item[2]}
                                                                    type="checkbox"
                                                                    defaultChecked={false}
                                                                    ref="complete"
                                                                    onChange={this.checkedBox}
                                                                />
                                                                <label style={{padding: 5}}>
                                                                    {item[2]}
                                                                </label>
                                                            </div>
                                                        }
                                                    </td>
                                                    <td style = {{'width':'100px'}}>
                                                        {item[4] === ""  ?  "None" : 
                                                            <div>
                                                                <input
                                                                    inline
                                                                    value = {item[4]}
                                                                    type="checkbox"
                                                                    defaultChecked={false}
                                                                    ref="complete"
                                                                    onChange={this.checkedBox}
                                                                />
                                                                <label style={{padding: 5}}>
                                                                    {item[4]}
                                                                </label>
                                                            </div>
                                                        }
                                                        

                                                    </td>
                                                    <td>
                                                            {item[5] === ""  ?  "None" : item[5]}
                                                    </td>
                                                    <td>
                                                            {item[6] === null  ?  "None" : item[6]}
                                                    
                                                    </td>
                                                    <td >
                                                            {item[7] === ""  ?  "None" : item[7]}
                                                    
                                                    </td>
                                                    <td >
                                                            {item[8] === null  ?  "None" : item[8]}
                                                    
                                                    </td>
                                                    <td >
                                                            {item[9] === ""  ?  "None" : item[9]}
                                                    </td>
                                                    <td style={{overflow:'auto', 'max-width':'300px'}}>
                                                            {item[11].length===0 ? "None" :
                                                                item[11].map((number) =>
                                                                    <li>{number}</li>
                                                            )}
                                                            {/* {item[11] === ""  ?  "None" : item[11]} */}
                                                    </td>
                                                    <td style = {{'max-width':'200px'}} >
                                                        <div class="container" style={{overflow:"auto"}}> 
                                                            {item[10] === ""  ?  "None" : item[10]}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button  style = {{float:'left'}} onClick = {() => this.onSendEdit(item)} type="button" class="btn btn-secondary btn-lg btn-block"> Edit
                                                        </button>
                                                    </td>
                                                    </tr> 
                                                ))}
                                            </tbody>
                                        </table>
                                    </Col>
                                </Row>
                            </div>
                            <Modal show={this.state.showEmails} onHide={this.state.showEmails}>
                                <Modal.Footer>
                                <Button variant="secondary" onClick={this.onHideEmails}>
                                    Close
                                </Button>
                                </Modal.Footer>
                                <Modal.Body>
                                    <div  style = {{display:'flex'}}>
                                        <div  style = {{borderStyle: 'solid', textAlign: "center", borderWidth: 1, margin:5, marginRight:5, width:"30%"}}>
                                            <div style = {{borderStyle: 'solid', textAlign: "center", borderWidth: 1, height:60 , padding:15}} > <strong>Lender</strong></div>
                                            {
                                            this.state.data.map( item => (
                                                <div style = {{ height:60, margin:5, marginLeft:"5.5%"}}>
                                                    {item[0] ==="" || item[0] === " "  ?  "None" : item[0]}
                                                </div> 
                                            ))}
                                        </div>
                                        
                                        <div  style = {{borderStyle: 'solid', textAlign: "center", borderWidth: 1, margin:5, marginRight:5, width:"70%"}}>
                                        <div style = {{borderStyle: 'solid', textAlign: "center", borderWidth: 1, height:60 , padding:15}} > <strong>Emails</strong></div>
                                            {
                                            this.state.data.map( item => (
                                                <div style = {{ height:60, margin:5, marginLeft:"5.5%"}}>
                                                    {item[2] ==="" || item[2] === " "  ?  "None" : item[2]}
                                                </div> 
                                            ))}
                                        </div>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                <Button variant="secondary" onClick={this.onHideEmails}>
                                    Close
                                </Button>
                                </Modal.Footer>
                            </Modal>
                            <Modal show={this.state.showPhone} onHide={this.state.showPhone}>
                                <Modal.Footer>
                                <Button variant="secondary" onClick={this.onHidePhone}>
                                    Close
                                </Button>
                                </Modal.Footer>
                                <Modal.Body>
                                    <div  style = {{display:'flex'}}>
                                        <div  style = {{borderStyle: 'solid', textAlign: "center", borderWidth: 1, margin:5, marginRight:5, width:"30%"}}>
                                            <div style = {{borderStyle: 'solid', textAlign: "center", borderWidth: 1, height:60 , padding:15}} > <strong>Lender</strong></div>
                                            {
                                            this.state.data.map( item => (
                                                <div style = {{ height:60, margin:5, marginLeft:"5.5%"}}>
                                                    {item[0] ==="" || item[0] === " "  ?  "None" : item[0]}
                                                </div> 
                                            ))}
                                        </div>
                                        
                                        <div  style = {{borderStyle: 'solid', textAlign: "center", borderWidth: 1, margin:5, marginRight:5, width:"70%"}}>
                                        <div style = {{borderStyle: 'solid', textAlign: "center", borderWidth: 1, height:60 , padding:15}} > <strong>Phone Numbers</strong></div>
                                            {
                                            this.state.data.map( item => (
                                                <div style = {{ height:60, margin:5, marginLeft:"5.5%"}}>
                                                    {item[4] ==="" || item[4] === " "  ?  "None" : item[4]}
                                                </div> 
                                            ))}
                                        </div>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                <Button variant="secondary" onClick={this.onHidePhone}>
                                    Close
                                </Button>
                                </Modal.Footer>
                            </Modal>
                            <Modal show={this.state.showEdit} onHide={this.state.showEdit}>
                                <Modal.Header>
                                    <Button variant="danger"  onClick={this.onDelete} >
                                        Delete
                                    </Button>
                                    <Button variant="secondary" onClick={this.onHideEdit}>
                                        Close
                                    </Button>
                                
                                </Modal.Header>
                                <Modal.Body>
                                    <Row className="g-2">
                                        <Form style = {{textAlign: "left"}}>
                                            <Col md>
                                                <Form.Group className="mb-3" >
                                                    <Form.Label><strong>Lender</strong></Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Lender" onChange={this.onChangeLender}  value={this.state.lender}/>
                                                </Form.Group>
                                            </Col>
                                            <Col md>
                                                <Form.Group className="mb-3" >
                                                    <Form.Label><strong>Region</strong></Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Region" onChange={this.onChangeRegion}  value={this.state.region}/>
                                                </Form.Group>
                                            </Col>
                                            <Col md>
                                                <Form.Group className="mb-3" >
                                                    <Form.Label><strong>Email</strong></Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Email" onChange={this.onChangeEmail}  value={this.state.email}/>
                                                </Form.Group>
                                            </Col>
                                            <Col md>
                                                <Form.Group className="mb-3" >
                                                    <Form.Label><strong>Contact</strong></Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Contact" onChange={this.onChangeContact}  value={this.state.contact}/>
                                                </Form.Group>
                                            </Col>
                                            <Col md>
                                                <Form.Group className="mb-3" >
                                                    <Form.Label><strong>Phone Number</strong></Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Phone Number" onChange={this.onChangePhoneNum}  value={this.state.phoneNum}/>
                                                </Form.Group>
                                            </Col>

                                            <Col md>
                                                <Form.Group className="mb-3" >
                                                    <Form.Label><strong>Interest Range</strong></Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Interest Range" onChange={this.onChangeInterestRange}  value={this.state.interestRange}/>
                                                </Form.Group>
                                            </Col>
                                            <Col md>
                                                <Form.Group className="mb-3" >
                                                    <Form.Label><strong>Minimum Credit Score</strong></Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Minimum Credit Score" onChange={this.onChangeMinCredScore}  value={this.state.minCredScore}/>
                                                </Form.Group>
                                            </Col>
                                            <Col md>
                                                <Form.Group className="mb-3" >
                                                    <Form.Label><strong>Max LTV</strong></Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Max LTV" onChange={this.onChangeMaxLTV}  value={this.state.maxLTV}/>
                                                </Form.Group>
                                            </Col>
                                            <Col md>
                                                <Form.Group className="mb-3" >
                                                    <Form.Label><strong>Max Amortization (years)</strong></Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Max Amortization" onChange={this.onChangeMaxAmort}  value={this.state.maxAmort}/>
                                                </Form.Group>
                                            </Col>
                                            <Col md>
                                                <Form.Group className="mb-3" >
                                                    <Form.Label><strong>Max Loan Amount</strong></Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Max Loan Amount" onChange={this.onChangeMaxLoanAmt}  value={this.state.maxLoanAmt}/>
                                                </Form.Group>
                                            </Col>
                                            <Col md>
                                                <Form.Group className="mb-3" >
                                                    <Form.Label><strong>Notes</strong></Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Notes" onChange={this.onChangeNotes}  value={this.state.notes}/>
                                                </Form.Group>
                                            </Col>
                                            <Col md>
                                                <strong> Loan Types </strong>
                                                <Row xs={3}>
                                                    {this.state.itemLoanTypes.map((type) => (
                                                        <div key={type} className="mb-3" >
                                                        
                                                                <Col>
                                                                <input
                                                                    inline
                                                                    value = {type}
                                                                    type="checkbox"
                                                                    defaultChecked={true}
                                                                    ref="complete"
                                                                    onChange={this.onChangeLoanType}
                                                                    
                                                                />
                                                                <label style={{padding: 5}}>
                                                                {type}
                                                                </label>
                                                                </Col>
                                                            
                                                        </div>
                                                    ))}
                                                    {this.state.displayLoanTypes.map( (loanType) => (
                                                        <div key={loanType} className="mb-3" >
                                                        
                                                            <Col>
                                                            <input
                                                                inline
                                                                value = {loanType}
                                                                type="checkbox"
                                                                defaultChecked={false}
                                                                ref="complete"
                                                                onChange={this.onChangeLoanType}
                                                                
                                                            />
                                                            <label style={{padding: 5}}>
                                                            {loanType}
                                                            </label>
                                                            </Col>
                                                    
                                                        </div>
                                                    ))}
                                                    
                                                </Row>
                                            </Col>
                                        </Form> 
                                    </Row>  
                                </Modal.Body>
                                <Modal.Footer>
                                <Button variant="secondary" onClick={this.onHideEdit}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={this.onSubmit}>
                                    Submit
                                </Button>
                            
                                </Modal.Footer>
                            </Modal>
                        {/* </Container> */}
                    
                        {/* <button onClick = {this.onSubmit} type="button" class="btn btn-light btn-lg">Search Again</button> */}
                    </div>
                  </div>
                
               
                
           );
        }
        else if(this.state.noData) {
            return( <div style = {{  padding: 100}}>
                <div style = {{ backgroundColor: 'white', borderRadius:10, padding: 25}}>
                    <Link to="/queryData" className="btn btn-secondary btn-lg btn-block" role="button"> Search Again</Link>
                    <div style = {{textAlign:"center", padding: 50}}>
                        <h1>No Search Results</h1>
                    </div>
                </div>
            </div>
            );
           
        }
        else
        {
            return (
                <div style = {{  padding: 100}}>
                    <div style = {{ backgroundColor: 'white', borderRadius:10, padding: 25}}>
                        <div style = {{textAlign:"center"}}>
                            <h1>Loading...</h1>
                        </div>
                    </div>
                </div>
            );
        }
          
            
        
    }
}