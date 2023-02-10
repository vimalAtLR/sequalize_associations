// const { Sequalize, Op, QueryTypes } = require("sequelize");

/*
// include-exclude columns
let data = await User.findAll({
    attributes: {
    exclude: ["created_at", "updated_at"],
    include: [
        // this will concat word Singh after the name
        [Sequelize.fn("CONCAT", Sequelize.col("name"), "Singh"), "fullName"]
    ]
    }
})
*/

/*
// select attributes, change column name
let data = await User.findAll({
    attributes: [
    "name",
    ["email", "emailId"], // this will change column name from "email" to "emailId"
    "gender",
    [Sequelize.fn("Count", Sequelize.col("email")), "emailCount"],  // this will return count of email
    ]
})
*/

/*
// find query with condition, order, group, pagination
let data = await User.findAll({
    where: {
    // id: 2,
    id: {
        [Op.gt] : 2,
    },
    email: {
        [Op.like]:  "%@gmail.com"
    },
    },
    order: [
    ["name", "DESC"],
    ["email", "DESC"]
    ],
    group: ["email", "name"],
    limit: 2,
    offset: 1
})
*/

/*
// findByPk
    let data = await User.findByPk(5);
*/

/*
// findOne
    let data = await User.findOne({});
*/

/*  
// findAndCountAll (this will return row and count)
    let data = await findAndCountAll({
    where: {
        email: "hello@gmail.com"
    }
    });
*/

/*  
// findOrCreate (this will return "data" and "created". If data already exist then it will return data with created: false flag, otherwise it will create new data and return with created: true flag)
    let [data, created] = await User.findOrCreate({
    where: {
        name: "dummy",
    },
    defaults: {
        email: "dummy@gmail.com",
        gender: "male"
    }
    });
*/  

/*
// setters and getters and model instances
    module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("users", {
        name: {
        type: DataTypes.STRING,
        // when create new data then this will set singh at the end of the name
        set(value) {
            this.setDataValue("name", value + " singh");
        },
        // when we get data then this will add xyz at the end of the name
        get() {
            this.getDataValue("name") + "xyz"
        }
        },
        email: {
        type: DataTypes.STRING,
        // defaultValue: "test@gmail.com",
        // allowNull: false,
        // unique: true,
        set(value) {
            this.setDataValue("email", value+ "@gmail.com")
        }
        },
        gender: {
        type: DataTypes.STRING,
        // setting validations
        validate: {
            equals: {
            args: "male",
            msg: "Please enter valid input"
            },
            // isIn: [["male", "female"]]
        }
        }
    }, {
        tableName: "user",
        timestamps: false,
        // createdAt: false,
        // updatedAt: false,
        createdAt: "created_at",
        updatedAt: "updated_at",
        engine: "MYISAM"
    })
    }
*/

/*  
// row/native query
    // let users = await db.sequelize.query("SELECT * from users WHERE gender IN(:gender)", {
    // let users = await db.sequelize.query("SELECT * from users WHERE email LIKE :searchEmail ", {
    type: QueryTypes.SELECT,
    // model: Users,
    // mapToModel: true,
    // raw: true,
    // replacements: { gender: 'male' }, // gender = :gender"
    // replacements: ["male"], // gender = ?
    // replacements: { gender: ["male", "female"]},  // gender IN(:gender)
    // replacements: { searchEmail: "%@gmail.com"}  // email LIKE :searchEmail

    })
*/  

// one-to-one association
/*
    db.users.hasOne(db.posts, {foreignKey: "user_id"});     // default foreignKey is userId
    db.posts.belongsTo(db.users, {foreighKey: "user_id"})

    // orm query on User table
    let data = await Users.findAll({
        attributes: ["name", "email"],
        include: [{
            model: Posts,
            attributes: ["title", ["name", "PostName"]]
        }],
        where: {
            id: 1
        }
    });

    // orm query on Post table
    let data = await Posts.findAll({
        attributes: ["content", "title"],
        include: [{
            model: Users,
            attributes: ["name", ["email", "userEmail"]]
        }],
    });
*/

// one-to-many association
/*
    db.users.hasMany(db.posts, { foreignKey: user_id });     // default foreignKey is userId
    db.posts.belongsTo(db.users, { foreignKey: user_id });

    // orm query on user table
    let data = await Users.findAll({
        attributes: ["name", "email"],
        include: [{
            model: Posts,
            attributes: ["title", ["name", "PostName"]]
        }],
        where: {
            id: 8
        }
    })
*/

// many-to-many association
/*
    db.posts.belongsToMany(db.tags, { through: "post_tag", foreignKey: "post_id" });        // through: "post_tag", here post_tag is third table which contains post_id and tag_id too
    db.tags.belongsToMany(db.posts, { through: "post_tag", foreignKey: "tag_id"});

    // Post--to--Tag
    let data = await Posts.findAll({
        attributes: ["title", "content"],
        include: [{
            model: Tags,
            attributes: ["name"]
        }].
    });

    // Tag--to--Post
    let data = await Tags.findAll({
        attributes: ["name"],
        include: [{
            model: Posts,
            attributes: ["title", "content"]
        }]
    })
*/

// Polymorphic one-to-many association
/*
    db.image.hasMany(db.comments, {
        foreignKey: "commentableId",
        constraints: false,
        scope: {
            commentableType: 'image',       // commentableType is column name of comment table
        }
    });
    db.video.hasMany(db.comments, {
        foreignKey: "commentableId",
        constraints: false,
        scope: {
            commentableType: 'video',       // commentableType is column name of comment table
        }
    });
    db.comment.belongsTo(db.image, { foreignKey: "commentableId", constraints: false });
    db.comment.belongsTo(db.video, { foreignKey: "commentableId", constraints: false });

    // Image--to--comment
    let data = await Image.findAll({
        include: [{
            model: Comment,
        }]
    });

    // Video--to--comment
    let data = await Video.findAll({
        include: [{
            model: Comment,
        }]
    });

    // Comment--to--image/video
    let data = await Comment.findAll({
        include: [
            {
                model: Image,
            },
            {
                model: Video,
            }
        ]
    })
*/

// Polymorphic Many-to-Many association
/*
    // table details
    image - (id, created_at, updated_at, title, url)
    video - (id, created_at, updated_at, title, text)
    tag - (id, created_at, updated_at, name)
    tag_taggables - (id, created_at, updated_at, tagId, taggableId(image/video id), taggableType(image/video))

    // Image--to--Tag
    db.image.belongsToMany(db.tags, {
        through: {
            model: db.tag_taggable,
            unique: true,
            scope: {
                taggableType: 'image'
            }
        },
        foreignKey: 'taggableId,
        constraints: false,
    });

    // Tag--to--Image
    db.tags.belongsToMany(db.image, {
        through: {
            model: db.tag_taggable,
            unique: true,
            scope: {
                taggableType: 'image'
            }
        },
        foreignKey: 'tagId',
        constraints: false,
    });

    // Video--to--Tag
    db.video.belongsToMany(db.tags, {
        through: {
            model: db.tag_taggable,
            unique: true,
            scope: {
                taggableType: 'video',
            }
        },
        foreignKey: 'taggableId',
        constraints: false,
    });

    // Tag--to--Video
    db.tags.belongsToMany(db.video, {
        through: {
            model: db.tag_taggable,
            unique: true,
            scope: {
                taggableType: 'video',
            }
        },
        foreignKey: 'tagId',
        constraints: false,
    });


    // Image-to-tag
    let data = await Image.findAll({
        include: [Tags]
    });

    // Video-to-tag
    let data = await Video.findAll({
        include: [Tags]
    });

    // Tag-to-image/video
    let data = await Tag.findAll({
        include: [Video, Image],
    });
    
*/
