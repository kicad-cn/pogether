import React from 'react'
import {Input, Form} from 'antd'
import PropTypes from 'prop-types';
import MsgidCards from './MsgCard'

const {TextArea} = Input;

const Formitem = Form.Item;


class singleEntry extends React.Component {
    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <MsgidCards msgid={this.props.Entry.Msgid}/>
                <Formitem>
                    {
                        getFieldDecorator('Msgstr',
                            {
                                rules: [{required:true, message: '请输入翻译文本'}],
                            })(<TextArea rows={4} disabled={this.props.InputDisable}/>)
                    }
                </Formitem>
            </div>

        );
    }
}


singleEntry.propTypes = {
    Entry: PropTypes.object,
    onChange: PropTypes.func,
    InputDisable: PropTypes.bool,
};

const SingleEntry = Form.create({
        onFieldsChange(props, changedFields) {
            props.onChange(changedFields);
        },
        mapPropsToFields(props) {
            return {
                Msgstr : Form.createFormField({
                    value:props.Entry.Msgstr
                })
            }

            ;
        },
    }
)(singleEntry);


export default SingleEntry;








