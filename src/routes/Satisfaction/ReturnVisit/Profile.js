import { PureComponent } from 'react'
import styles from './Profile.less'
import patientInfo from '../../../assets/patient.png'
import { Select, Table, Input, Button, Breadcrumb, Form, message } from 'antd';
import { connect } from 'dva'
import { routerRedux } from 'dva/router'

import Modal from 'components/Modal'

const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item

@Form.create()

class SatisfactionDetail extends PureComponent {
	state = {
		conclusionShow: false,
		medicineShow: false,
		commentShow: false,
		detailShow: false,
		remarkShow: false,
		inhospitalId: this.props.match.params.id,
		// scaleId: this.props.match.params.scaleId,
		medicineSquareTime: '',
		medicineResident: '',
		remarkReason: '',
		remarkDes: '',
	}
	
	hideIdCard=(id)=>{
		if(!id){
			return
		}
		if(id.length===18){
			return String(id).replace(String(id).substr(4,10),'**********')
		}else if(id.length===15){
			return String(id).replace(String(id).substr(4,7),'*******')
		}else{
			return id
		}
	}
	showConclusion=()=>{
		this.setState({
			conclusionShow: true
		})
	}
	hideConclusion=()=>{
		this.setState({
			conclusionShow: false
		})
	}
	showDetail=()=>{
		this.setState({
			detailShow: true
		})
	}
	hideDetail=()=>{
		this.setState({
			detailShow: false
		})
	}
	showMedicine=()=>{
		this.setState({
			medicineShow: true
		})
	}
	hideMedicine=()=>{
		this.setState({
			medicineShow: false
		})
	}
	showComment=()=>{
		this.setState({
			commentShow: true
		})
	}
	hideComment=()=>{
		this.setState({
			commentShow: false
		})
	}
	addComment = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if(!err){
				console.log('wwww', values)
				const param = {
					taskId: this.props.patientDetail.satisfyDetail.satisfyTask.taskId,
					remarkReason: values.reason,
					remarkDes: values.desc
				}
				console.log(param)
				this.props.dispatch({
					type: 'patientDetail/addRemark',
					payload: param
				}).then(()=>{
					this.setState({
						commentShow: false,
						remarkReason: values.reason,
						remarkDes: values.desc,
						remarkShow: true
					})
					message.success('添加成功！')
				})
			}
		})

	}

	goList=()=>{
  		this.props.dispatch(routerRedux.push(`/satisfaction/returnVisit/list`));
  	}

	componentDidMount( ){
		this.props.dispatch({
			type: 'global/fetchDict'
		})
  		this.props.dispatch({
  			type: 'patientDetail/fetchSummary',
  			payload: this.state.inhospitalId
  		})
  		this.props.dispatch({
  			type: 'patientDetail/fetchMedicine',
  			payload: this.state.inhospitalId
  		}).then(()=>{
  			if(this.props.patientDetail.outMedicine.length>0){
  				this.setState({
					medicineSquareTime: this.props.patientDetail.outMedicine[0].squareTime,
					medicineResident: this.props.patientDetail.outMedicine[0].resident
				})
  			}else{
  				this.setState({
					medicineSquareTime: '暂无',
					medicineResident: '暂无'
				})
  			}
  		})
		this.props.dispatch({
			type: 'patientDetail/fetchSatisfy',
			payload: {
				inhospitalId: this.state.inhospitalId,
				// scaleId: this.state.scaleId
			}
		}).then(()=>{
			this.setState({
				remarkShow: this.props.patientDetail.satisfyDetail.satisfyTask.remarkReason?true:false,
				remarkReason: this.props.patientDetail.satisfyDetail.satisfyTask.remarkReason,
				remarkDes: this.props.patientDetail.satisfyDetail.satisfyTask.remarkDes
			})
		})		
	}


	render(){
		const { 
			conclusionShow, 
			medicineShow, 
			commentShow, 
			detailShow,
			remarkShow,
			remarkReason,
			remarkDes,
			medicineSquareTime,
			medicineResident
		} = this.state

		const {
			satisfyDetail,
			outSummary,
			outMedicine
		} = this.props.patientDetail

		const {dictionary} = this.props.global

		const {
			getFieldDecorator
		} = this.props.form

		const columns = [{
			title: '药品名称',
			dataIndex: 'drugsName',
			key: 'drugsName'
		},{
			title: '药品规格',
			dataIndex: 'drugSpecifications',
			key: 'drugSpecifications'
		},{
			title: '药品数量',
			dataIndex: 'amount',
			key: 'amount',
			render: (text, record) => (
				<span>{record.number+record.unit}</span>
			)
		},{
			title: '用法用量',
			dataIndex: 'usage',
			key: 'usage'
		}]
		return (
			<div>
				<div className={styles.contentWrap}>
					<Breadcrumb separator=">">
					    <Breadcrumb.Item>满意度</Breadcrumb.Item>
					    <Breadcrumb.Item onClick={this.goList}>
					    	<a>满意度回访</a>
					    </Breadcrumb.Item>
					    <Breadcrumb.Item>开始回访</Breadcrumb.Item>
				  	</Breadcrumb>
					<div className={`${styles.patientInfo} clearfix`}>
						<div className={styles.infoWrap}>
							<div className={styles.img}>
								<img src={patientInfo} alt="头像"/>
							</div>
							<div className={styles.info}>
								<div className={styles.infoItemWrap}>
									<div className={styles.infoItem}>
										<span className={styles.basicInfo}>{satisfyDetail.patientName}</span>
										<span className={styles.basicInfo}>{satisfyDetail.sex}</span>
										<span className={styles.basicInfo}>{satisfyDetail.age}岁</span>
									</div>
									<div className={styles.infoItem}>
										<span className={styles.label}>身份证号：</span>
										<span className={styles.text}>{this.hideIdCard(satisfyDetail.cardNo)}</span>
									</div>
								</div>
								<div className={styles.infoItemWrap}>									
									<div className={styles.infoItem}>
										<span className={styles.label}>联系人：</span>
										<span className={styles.text}>{satisfyDetail.patientRelationship} {satisfyDetail.contactPeople}</span>
									</div>
									<div className={styles.infoItem}>
										<span className={styles.label}>费用类型：</span>
										<span className={styles.text}>{satisfyDetail.costType}</span>
									</div>
									
								</div>
								<div className={styles.infoItemWrap}>
									<div className={styles.infoItem}>
										<span className={styles.label}>联系电话：</span>
										<span className={styles.text}>{satisfyDetail.contactPhone}</span>
									</div>
									<div className={styles.infoItem}>
										<span className={styles.label}>家庭住址：</span>
										<span className={`${styles.text} text-hidden`}>{satisfyDetail.contactAddress}</span>
									</div>
								</div>
							</div>
						</div>
						<div className={styles.call}>
							<i className={`iconfont icon-red_phone ${styles.callIcon}`}></i>
							<div className={styles.text}>拨打电话</div>
						</div>
					</div>
					<div className={styles.mainInfo}>
						<div className={styles.overFlow}>
							<div className={styles.info}>
								<div className={styles.title}>
									<i className={`iconfont icon-tongyongbiaotiicon ${styles.titleIcon}`}></i><span>患者信息</span>
								</div>
								<div className={styles.content}>
									<div className={styles.line}>
										<div className={styles.infoItem}>
											<span className={styles.label}>住院科室：</span>
											<span className={`${styles.text} text-hidden`}>{satisfyDetail.hospitalizationDepartment}</span>
										</div>
										<div className={styles.infoItem}>
											<span className={styles.label}>转归情况：</span>
											<span className={`${styles.text} text-hidden`}>{satisfyDetail.physicalCondition}</span>
										</div>
										<div className={styles.infoItem}>
											<span className={styles.label}>出院带药：</span>
											<span className={`${styles.text} aLink`} onClick={this.showMedicine}>点击查看</span>
										</div>
									</div>
									<div className={styles.line}>
										<div className={styles.infoItem}>
											<span className={styles.label}>病区：</span>
											<span className={styles.text}>{satisfyDetail.wards}</span>
										</div>
										<div className={styles.infoItem}>
											<span className={styles.label}>出院日期：</span>
											<span className={styles.text}>{satisfyDetail.dischargeTime}</span>
										</div>
										<div className={styles.infoItem}>
											<span className={styles.label}>随访：</span>
											<span className={styles.text}>
												<span className="aLink">已随访</span>
												<span style={{display: 'none'}}>未随访</span>
											</span>
										</div>	
									</div>
									<div className={styles.line}>
										<div className={styles.infoItem}>
											<span className={styles.label}>床号：</span>
											<span className={styles.text}>{satisfyDetail.bedNumber}</span>
										</div>
										<div className={styles.infoItem}>
											<span className={styles.label}>住院天数：</span>
											<span className={styles.text}>{satisfyDetail.hospitalizationDays}天</span>
										</div>
										<div className={styles.infoItem}>
											<span className={styles.label}>随访备注：</span>
											<span className={styles.text}>
												<span style={{display: remarkShow?'none':'inline'}} className="aLink" onClick={this.showComment}>点击备注</span>
												<span style={{display: remarkShow?'inline':'none'}} >
													<span className={styles.remark}>
														{
															dictionary['REMARK_CAUSE']?
														      	dictionary['REMARK_CAUSE'].map(item => (
														      		remarkReason===item.code?item.value:''
														      	))
												      		:''
														}
													</span>
													<span className="aLink" onClick={this.showComment}>点击查看</span>
												</span>
											</span>
										</div>								
									</div>
									<div className={styles.line}>
										<div className={styles.infoItem}>
											<span className={styles.label}>住院号：</span>
											<span className={`${styles.text} text-hidden`}>{satisfyDetail.inhospitalId}</span>
										</div>
										<div className={styles.infoItem}>
											<span className={styles.label}>出院诊断：</span>
											<span className={`${styles.text} text-hidden`}>{satisfyDetail.dischargeDiagnosis}</span>
										</div>
										
									</div>
									<div className={styles.line}>
										<div className={styles.infoItem}>
											<span className={styles.label}>主管医生：</span>
											<span className={styles.text}>{satisfyDetail.resident}</span>
										</div>
										<div className={styles.infoItem}>
											<span className={styles.label}>出院小结：</span>
											<span className={`${styles.text} aLink`} onClick={this.showConclusion}>点击查看</span>
										</div>
									</div>
								</div>
							</div>
							<Modal title="添加备注" closable={false} visible={commentShow} type="small"
								 onCancel={this.hideComment}>
								<Form onSubmit={this.addComment}>
									<FormItem>
										<div className={styles.stopItem}>
											<span className={styles.label}>备注原因</span>
											{
												getFieldDecorator('reason',{
													initialValue: remarkReason,
													rules: [{ required: true, message: '请输入备注原因！'}]
												})(
													<Select placeholder="请选择" style={{ width: 353 }}
														allowClear>
												      	{
												      		dictionary['REMARK_CAUSE']?
														      	dictionary['REMARK_CAUSE'].map(item => (
														      		<Option key={item.code} value={item.code}>{item.value}</Option>
														      	))
												      		:''
									      				}
												    </Select>
												)
											}
											
										</div>
									</FormItem>
									<FormItem>
										<div className={styles.stopItem}>
											<span className={styles.label}>描述</span>
											{
												getFieldDecorator('desc',{
													initialValue: remarkDes,
													rules: [{ required: true, message: '请输入描述！'}]
												})(
													<TextArea style={{ width: 353, height: 120 }} />
												)
											}
											
										</div>
									</FormItem>
									<div className={styles.stopBtn}>
											<Button type="primary" htmlType="submit">确认</Button>
											<Button onClick={this.hideComment}>取消</Button>								
										</div>
								</Form>
								
							</Modal>
							<Modal title="出院小结" closable={true} visible={conclusionShow} onCancel={this.hideConclusion}>
								<div className={styles.conclusionTitle}>
									<div className={styles.titleItem}>
										<span className={styles.label}>病区：</span>
										<span className={styles.text}>{outSummary?outSummary.wards:'暂无'}</span>
									</div>
									<div className={styles.titleItem}>
										<span className={styles.label}>床号：</span>
										<span className={styles.text}>{outSummary?outSummary.bedNumber:'暂无'}</span>
									</div>
								</div>
								<div className={styles.conclusionContent}>
									<div>
										<div className={`${styles.item} ${styles.specialItem}`}>
											<span className={styles.label}>入院日期：</span>
											<span className={styles.text}>{outSummary?outSummary.admittingTime:'暂无'}</span>
										</div>
										<div className={`${styles.item} ${styles.specialItem}`}>
											<span className={styles.label}>出院日期：</span>
											<span className={styles.text}>{outSummary?outSummary.dischargeTime:'暂无'}</span>
										</div>
										
									</div>
									<div className={styles.item}>
										<span className={styles.label}>入院诊断：</span>
										<span className={styles.text}>{outSummary?outSummary.admittingDiagnosis:'暂无'}</span>
									</div>
									<div className={styles.item}>
										<span className={styles.label}>出院诊断：</span>
										<span className={styles.text}>{outSummary?outSummary.dischargeDiagnosis:'暂无'}</span>
									</div>
									<div className={styles.item}>
										<span className={styles.label}>入院情况：</span>
										<span className={styles.text}>{outSummary?outSummary.admittingDescription:'暂无'}</span>
									</div>
									<div className={styles.item}>
										<span className={styles.label}>住院经过：</span>
										<span className={styles.text}>{outSummary?outSummary.hospitalizationCourse:'暂无'}</span>
									</div>
									<div className={styles.item}>
										<span className={styles.label}>出院情况：</span>
										<span className={styles.text}>{outSummary?outSummary.dischargeCondition:'暂无'}</span>
									</div>
									<div className={styles.item}>
										<span className={styles.label}>住院医嘱：</span>
										<span className={styles.text}>{outSummary?outSummary.doctorAdvance:'暂无'}</span>
									</div>
									<div className={styles.sign}>
										签名：{outSummary?outSummary.recordMember:'暂无'}
									</div>
								</div>
							</Modal>
							<Modal title="出院带药" closable={true} visible={medicineShow} onCancel={this.hideMedicine}>
								<div className={styles.medicineTitle}>
									<div className={styles.item}>
										<span className={styles.label}>开方时间：</span>
										<span className={styles.text}>{medicineSquareTime}</span>
									</div>
									<div className={styles.item}>
										<span className={styles.label}>医师：</span>
										<span className={styles.text}>{medicineResident}</span>
									</div>
								</div>
								<div className={styles.medicineContent}>
									<Table dataSource={outMedicine} columns={columns} pagination={false}
										rowKey="incrementId"/>
								</div>
							</Modal>
							<Modal title="随访详情" closable={true} visible={detailShow} onCancel={this.hideDetail}>
								11111
							</Modal>
						</div>
					</div>
				</div>
				
				
			</div>
		)
	}
}

export default connect(({ patientDetail, global }) => ({
  patientDetail, global
}))(SatisfactionDetail);