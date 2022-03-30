const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise{
  FULFILLED_CALLBACK_LIST = []
  REJECTED_CALLBACK_LIST = []
  _status = PENDING

  constructor(fn){
    this.status = PENDING
    this.value = null
    this.reason = null

    try {
      fn(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      this.reject(error)
    }
    
  }

  get status(){
    return this._status
  }

  set status(newStatus){
    this._status = newStatus
    switch (newStatus) {
      case FULFILLED:
        this.FULFILLED_CALLBACK_LIST.forEach(callback =>{
          callback(this.value)
        })
        break;
      case REJECTED:
        this.REJECTED_CALLBACK_LIST.forEach(callback =>{
          callback(this.reason)
        })
        break
      default:
        break;
    }
  }

  resolve(value){
    if(this.status == PENDING){
      this.value = value
      this.status = FULFILLED
    }
  }
  reject(reason){
    if(this.status == PENDING){
      this.reason = reason
      this.status = REJECTED
    }
  }
  isFunction(param){
    return typeof param === 'function'
  }
  then(onFulfilled, onRejected){
    const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) =>{
      return value
    }
    const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) =>{
      return reason
    }

    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotack = () =>{
        queueMicrotask(() => {
          try {
            resolve(realOnFulfilled())
          } catch (error) {
            reject(error)
          }
        })
      }
      const rejectedMicrotack = () =>{
        queueMicrotask(() => {
          try {
            resolve(realOnRejected())
          } catch (error) {
            reject(error)
          }
        })
      }

      switch(this.status){
        case FULFILLED:
          fulfilledMicrotack()
          break
        case REJECTED:
          rejectedMicrotack()
          break
        case PENDING:
          this.FULFILLED_CALLBACK_LIST.push(fulfilledMicrotack)
          this.REJECTED_CALLBACK_LIST.push(rejectedMicrotack)
      }
    })

    return promise2
  }

  catch(onRejected){
    return this.then(null, onRejected)
  }

  finally(callback){
    return this.then((value) => {
      return MyPromise.resolve(callback()).then(() => value)
    }, (err) => {
      return MyPromise.resolve(callback()).then(() => {throw err})
    })
  }

  static resolve(value){
    if(value instanceof MyPromise){
      return value
    }
    return new MyPromise((resolve) => {
      resolve(value)
    })
  }

  static reject(reason){
    return new MyPromise((resolve,reject) =>{
      reject(reason)
    })
  }

  static race(list){
    return new MyPromise((resolve, reject) => {
      const length = list.length
      if(length === 0) return resolve()
      list.forEach(item => {
        MyPromise.resolve(item).then((value) =>{
          return resolve(value)
        },(reason) => {
          return reject(reason)
        })
      })
    })
  }

  static all(list){
    return new MyPromise((resolve, reject) => {
      let res = []
      let count = 0
      for(let i = 0; i < list.length; i++){
        MyPromise.resolve(list[i]).then((value) =>{
          res[i] = value
          count++
          if(count === list.length){
            resolve(res)
          }
        }).catch((reason) => {
          reject(reason)
        })
      }
    })
  }
}