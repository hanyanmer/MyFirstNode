# Sequelize常用的操作



```js
const {Sequelize} = require('sequelize')
let seq = new Sequelize('database','username','password',{
    host: '',
    dialect: 'mysql',
})
module.exports = seq
```

## 1 创建表

使用seq对象创建表，并获取模型对象

```js
const {DataTypes} = require('sequelize')
const User = seq.define('db_user',{
    user_name:{
        type:DataTypes.STIRNG,
        allowNull:false,
        defaultValue:'',
    }
})
//数据库中的表明就是在我们起的基础上加了一个s，叫做db_users

//同步模型（创建表）
User.sync()  //执行创建表，如果数据库中存在就不执行
User.sync({force:true}) //执行创建表，如果数据库中存在的话也会强制的重新创建表
```

创建表的时候默认会加上createdAt、updatedAt这两个时间字段，如果不想加入的话使用time stamps：false参数来禁用

```js
seq.define('',{
    
},{
    timestamps:false
})
也可以只启用其中的一个
seq.define('',{
    
},{
    timestamps:true,
    //使用，同时希望名称为createTime
    createdAt:'createTime' ,
    updatedAt:false,
    comment: '字段的说明',
})
```



## 2  删除表

```js
//删除于模型相关的表
await User.drop()
//删除所有的表
await seq.drop()
```



## 3 对表的增删改查

对表的操作都是通过在模型对象上的

### 3.1 添加数据

#### 3.1.1 添加一条数据

在es6中模型是类需要通过build创建一个实例，然后使用save保存数据。create合并两个方法的功能。所以通过create用来添加数据

```js
const res = await User.create({user_name:'han'})
//han已经存储到了数据库中了
console.log(res.name) //han
```

#### 3.1.2 添加一条递增数据

```js
const res = await User.create({user_name:'han',age:80})
//如果是加一，就不需要by参数
const increateResult = res.increment('age',{by:2})
```



#### 3.1.3 添加一条递减数据

同上

### 3.2 更新数据

更改实例的某个字段，可以通过save进行更新

```js
const res = await User.create({user_name:'han'})
res.name = 'lele'
await res.save()
```

使用set方法一次更新多个字段

```js
const res = await User.create({user_name:'han',password:123})
res.set({
    user_name: 'lele',
    password: 345
})
await res.save()
```

更新一组特定的字段，使用update

```js
const res = await User.create({user_name:'han'})
await res.update({name:'lele'})
await res.save()
```

### 3.3 删除实例--删除一条数据

```js
const res = await User.create({user_name:'han'})
await res.destory()
```

### 3.4 重载实例--reload相当于调用select获取最新数据

```js
await res.reload()
```

### 3.5 查

#### 3.5.1简单的insert查询

```js
const res = await User.create({user_name:'han'})
console.log(res.name)
```

#### 3.5.2 简单的select查询

使用findAll从数据库中查询整个表

```js
//相当于select * from 
const users = await User.findAll()
users.every(user=>user instanceof User) //true
```

选择某些特定的属性，使用attributes参数

```js
//相当于 select user_name,password from 
await ModelName.findAll({
    attribures:['user_name','password']
})

可以使用嵌套属性来重命名属性
//相当于 select user_name,password as mypassword from
await ModelName.findAll({
    attributes:['user_name',['password','mypassword']]
})

也可以通过包括和排除属性
使用seq.fn进行聚合操作，下面的seq.fn相当于,计算个数
select count(user_name) from 
await ModelName.findAll({
    attributes:{
        include:[
            [seq.fn('COUNT'),seq.col('user_name'),'userName']
        ],
        exclude:[
            '排除的属性'
        ]
    }
})
```

应用where子句

```js
//相当于select * from User where user_name="han"
User.findAll({
    where:{
        user_name:'han'
    }
})

使用[Op.eq]
const {Op} = require('sequelize')
//select * from User where user_name="han"
User.findAll({
    where:{
        user_name:{
            [Op.eq]:2
        }
    }
})
```

where中and条件

```js
//select * from User where user_name="han" and password="123"
User.findAll({
    where:{
        user_name:'han',
        password:'123'
    }
})

[Op.and]
User.findAll({
    where:{
        //多个限制条件的时候Op先写
        [Op.and]:{
            {user_name:'han'},
        	{password:'123'}
        }
    }
})
```

where中or条件

```js
//select * from User where user_name="han" or user_name:'le'
User.findAll({
    where:{
        //一个条件的时候属性先写
        user_name:{
             [Op.or]:['han','le']
        }
    }
})
```

其他Op操作

```js
[Op.and]
[Op.or]
[Op.eq]
[Op.ne]
[Op.is]  isnull
[Op.not] isnot null
[Op.or] 

[Op.col]

[Op.gt]
[Op.gte]
[Op.lt]
[Op.lte]
[Op.between]
[Op.notBetween]
```

#### 3.5.3 update,delete也支持where

```js
User.update({
    where:{
        user_name:'han'
    }
})

User.destory({
    where:{
        name:'han'
    }
})
```

#### 3.5.4 排序和分组

排序 order

```js
User.findAll({
    order:[
        //按照user_name将返回值按照降序排列
        ['user_name','DESC'],
        //按照年龄最大的进行升序排序
        seq.fn('max',seq.col('age'))
        //降序排序
        [seq.fn('max',seq.col('age')),'DESC']	
    ]
})
```

分组 group

```js
//group by user_name
User.findAll({
    group:'user_name'
})
```

限制和分页limit offset

```js
//提取10条数据
User.findAll({
    limit:10
})
//跳过8条数据
User.findAll({
    offset:8
})
//跳过5条数据，返回5条数据
User.findAll({
    offset:5,
    limit:5
})
```

计算元素出现的次数count

```js
const count = await User.count({
    where:{
        id:{
            [Op.gt]:15
        }
    }
})
```

max,min,sum 

```js
await User.max('age')
await User.min('age')
await User.sum('age')
```

increment,decrement

```js
//将id=2的这个年龄增加5岁
User.increment({age:5},{where {id:2}}) 
```



### 3.6 查找器

#### 3.6.1 findByPk

使用提供的主键从表中仅获得一个条目

```js
const user = await User.findByPk(123)
```

#### 3.6.2 findOne

获得它找到的第一条数据

```js
const user = await User.findOne({
    where :{
        user_name:'han'
    }
})
```

#### 3.6.3 findOrCreate

如果没有找到一个满足查询参数的结果，会创建一个数据。同时这两种情况下都会返回两个参数，一个是实例和一个布尔值（指示该实例是否存在）

```js
const {user,created} = await User.findOrCreate({
    where:{
        user_name:'han'
    }
})
```

#### 3.6.4 findAndCountAll

结合了findAll和count。当没有提供group时，调用该方法会具有count（一个整数表示记录总数）和rows（获得的记录）两个属性的对象。当有group时count就变成了包含每组的对象数组。

```js
const {count,rows} = await User.findAndCountAll({
    where:{
        user_name:{
            [Op.like]:'han%'
        }
    },
    offset:10,
    limit:2
})
```

## 4 其他操作

### 4.1 关联

HasOne关联

A.HasOne(B)  A中有一个属性是B的主键

BelongsTo

B.BelongsTo(A)  B中的主键属于A的某个属性























