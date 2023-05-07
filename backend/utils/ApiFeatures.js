class ApiFeatures{
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }
    search(){
        let keyword =this.queryString.keyword? {
            name:{
                $regex: this.queryString.keyword,
                $options: 'i'
            }
        }:{}
        this.query = this.query.find(keyword);
        return this;
    }
    filter(){
        const queryCopy = { ...this.queryString };

        //Removing Fields which are not in schema from query
        const removedFields = ["keyword","limit","page"];
        removedFields.forEach(field => delete queryCopy[field]);

        let queryString = JSON.stringify(queryCopy);
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, match=>`$${match}`);
        
        this.query = this.query.find(JSON.parse(queryString));
        return this;
        
    }

    pagination(perPage){
        const currentPage = Number(this.queryString.page) || 1;
        const skip = perPage*(currentPage-1);

        this.query = this.query.skip(skip).limit(perPage);
        return this;
    }
}

module.exports = ApiFeatures;