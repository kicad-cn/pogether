import React from 'react'
import { Card} from 'antd'
import PropTypes from 'prop-types';

class MsgidCard extends React.Component{
    render(){
        return(
            <Card>
                {this.props.msgid}
            </Card>
        )
    }

}

MsgidCard.propTypes={
    msgid: PropTypes.string
}

export default MsgidCard;