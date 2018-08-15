import React from 'react'
import {Form, Input} from 'antd'
import PropTypes from 'prop-types';

const {TextArea} = Input;

const Formitem = Form.Item;


class singleEntry extends React.Component {
    render() {
        const {getFieldDecorator} = this.props.form;
        let container;
        if (this.props.disableEdit)
            container = this.props.Entry.Msgstr;
        else
            container = (
                <Formitem
                >
                    {
                        getFieldDecorator('Msgstr',
                            {
                                rules: [{required: true, message: '请输入翻译文本'}],
                            })(<TextArea

                            ref={(input) => input.focus()}
                            rows={3} disabled={this.props.disableEdit} placeholder={"请输入翻译文本"}/>)
                    }
                </Formitem>)
        return (
            <div>

                {this.props.Entry.Msgid}
                <br/>
                <br/>
                {container}

            </div>

        );
    }
}


singleEntry.propTypes = {
    Entry: PropTypes.object,
    onChange: PropTypes.func,
    disableEdit: PropTypes.bool,
};

const SingleEntry = Form.create({
        onFieldsChange(props, changedFields) {
            props.onChange(changedFields);
        },
        mapPropsToFields(props) {
            return {
                Msgstr: Form.createFormField({
                    value: props.Entry.Msgstr
                })
            }

                ;
        },
    }
)(singleEntry);


export default SingleEntry;








