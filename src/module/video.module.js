import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new Schema({

vidoeFile :{
    type :String ,// cloud url
    required :true
},
thumbnail:{
    type :String ,
    required :true
}
,
title:{
    type :String ,
    required :true
},
description:{
    type :String ,
    required :true
},
duration:{
    type :String ,
    required :true

},
view:{
    type :Number ,
    default :0
},
isPublish:{
    type :Boolean,
    default:true
},

owner:{
    type : Schema.Types.ObjectId,
    ref:"User"
}


},{timestaps:true})



videoSchema.plugin(mongooseAggregatePaginate)




export const Video = Schema.model("Video",videoSchema)