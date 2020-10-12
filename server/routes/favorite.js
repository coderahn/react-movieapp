const express = require('express');
const router = express.Router();
const { Favorite } = require('../models/Favorite')

router.post('/favoriteNumber', (req,res) => {
    //mongoDB에서 favorite 숫자를 가져오기
    //그다음에 프론트에 다시 숫자 정보를 보내주기

    //favorite를 누르면, Favorite.js의 Axios.post로 인하여 server의 favorite.js 호출(여기)
    //model의 Favorite의 find함수로, 요청한 movieId와 model의 아이디가 일치하면, 클릭한 만큼의 length보내기?
    Favorite.find({"movieId" : req.body.movieId})
        .exec((err, info) => {
            if(err) return res.status(400).send(err)
            res.status(200).send({success : true, favoriteNumber : info.length})
        })
})

router.post('/favorited', (req,res) => {
    //내가 이 영화를 Favorite 리스트에 넣었는지 정보를 가져오기
    Favorite.find({"movieId" : req.body.movieId, "userFrom" : req.body.userFrom})
        .exec((err, info) => {
            if(err) return res.status(400).send(err)
            
            //info가 []나오면 ? -> 해당하는 영화를 Favorite List에 안넣음
            //info가 나오면 ? -> '나'가 '해당하는 영화'를 Favorite List에 넣음
            let result = false;
            if(info.length !== 0){  //favorited에 해당 영화 있음
                result = true;
            }
            res.status(200).send({success : true, favorited : result})
        })
})

router.post("/removeFromFavorite", (req, res) => {
    Favorite.findOneAndDelete({ movieId: req.body.movieId, userFrom: req.body.userFrom })
        .exec((err, doc) => {
            if (err) return res.status(400).json({ success: false, err });
            return res.status(200).json({ success: true, doc })
        })
});


router.post('/addToFavorite', (req,res) => {
    const favorite = new Favorite(req.body)

    favorite.save((err,doc) => {
        if(err) return res.status(400).send(err)
        return res.status(200).json({success:true})
    })
})

router.post('/getFavoritedMovie', (req,res) => {
    Favorite.find({'userFrom' : req.body.userFrom})
        .exec((err,favorites) => {
            if(err) return res.status(400).send(err)
            return res.status(200).json({success:true, favorites})
        })
})


router.post("/removeFromFavorite", (req, res) => {
    Favorite.findOneAndDelete({ movieId: req.body.movieId, userFrom: req.body.userFrom })
        .exec((err, result) => {
            if (err) return res.status(400).json(err);
            return res.status(200).json({ success: true, result })
        })
});


module.exports = router;
