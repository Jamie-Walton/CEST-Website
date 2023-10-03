import React from "react";

class Page extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
        }
      }
    
    render() {
        return(this.props.page);
    }

}

export default (Page);