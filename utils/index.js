import moment from "moment";

export default {
	ifequal(arg1,arg2,options){
		if(arg1 == arg2){
			return options.fn(this);
		}
		return options.inverse(this)
	},
	avatarFormat(firstName, lastName){
		return firstName.charAt(0) + lastName.charAt(0);
	},
	convertDate(date){
		return moment(date).fromNow()
	} 	
}