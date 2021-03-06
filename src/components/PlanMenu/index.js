import React, { Component } from 'react';
import styles from './index.less';

export default class PlanMenu extends Component {
	state = {
		// status: '1'
	}
	colorChange(type){
		if(type==='COMPLETE'){
			return styles.grey
		}else if(type==='OVERDUE'){
			return styles.red
		}else if(type==='WAIT'){
			return styles.green
		}else if(type==='NO_START'){
			return styles.yellow
		}else{
			return ''
		}
	}
	iconChange(type){
		if(type==='COMPLETE'){
			return 'yisuifang-icon-color'
		}else if(type==='OVERDUE'){
			return 'suifangyuqi-icon-color'
		}else if(type==='WAIT'){
			return 'daisuifangicon-color'
		}else if(type==='NO_START'){
			return 'shijianweidao-icon-color'
		}else{
			return ''
		}
	}
	typeChangeText(type){
		if(type==='COMPLETE'){
			return '已随访'
		}else if(type==='OVERDUE'){
			return '随访逾期'
		}else if(type==='WAIT'){
			return '待随访'
		}else if(type==='NO_START'){
			return '时间未到'
		}else{
			return ''
		}
	}
	render(){
		const {listData, status, dictionary} = this.props
		return(
			<div>
				{listData?
					listData.map(item => (
					<div key={item.taskId} className={`${styles.menuItemWrap} ${this.colorChange(item.status)} ${status==item.taskId?styles.menuItemChoosed:''}`}
						onClick={() => this.props.changeStatus(item.taskId, item.scaleId, item.status)}>
						<div className={styles.menuItem}>
							<i className={`iconfont icon-${this.iconChange(item.status)} ${styles.itemIcon}`}></i>
							<div className={styles.content}>
								<div className={styles.itemTitle}>
									{item.followTime}
								</div>
								<div className={styles.info}>
									{dictionary['RETURN_WAY']?dictionary['RETURN_WAY'].map(dic=>(
										item.returnType===dic.code?dic.value:''
				                    )):''}
								</div>
								<div className={styles.tags}>
									<span>{this.typeChangeText(item.status)}</span>
								</div>
							</div>
						</div>
						
					</div>
					))
				:''
			}
			</div>
			
		)
	}
}