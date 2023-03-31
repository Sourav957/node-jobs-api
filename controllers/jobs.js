const Job = require('../models/Job.js');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError,NotFoundError} = require('../errors/index.js');



const getAllJobs = async(req,res) => {
    const jobs = await Job.find({createdBy:req.user.userID}).sort('createdAt');

    res.status(StatusCodes.OK).json({jobs,count:jobs.length});
}

const getJob = async(req,res) => {
    const {user:{userID},params:{id:jobId}} = req;

    const job = await Job.findOne({
        _id:jobId,
        createdBy:userID
    });

    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }

    res.status(StatusCodes.OK).json({job});
}

const createJob =async(req,res) => {
    console.log(req.body);
    console.log(req.user.userID);
    req.body.createdBy = req.user.userID;
    const job1 = await Job.create(req.body); 
    console.log(job1);

    res.status(StatusCodes.CREATED).json({job1});
}

const updateJob = async(req,res) => {

    const {user:{userID},params:{id:jobId},body:{company,position}} = req;

    if(company === '' || position === ''){
        throw new BadRequestError('Comapny or positions field cannot be empty ');
    }

    const job = await Job.findOneAndUpdate({_id:jobId,createdBy:userID},req.body,{new:true,runValidators:true});
    
    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }

    res.status(StatusCodes.OK).json({job});

}

const deleteJob = async(req,res) => {
    const {user:{userID},params:{id:jobId}} = req;

    const job = await Job.findByIdAndRemove({
        _id:jobId,
        createdBy:userID
    })

    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }

    res.status(StatusCodes.OK).send()

}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}