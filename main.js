//Game View
kaboom({
    width: 1000,
    height: 800,
})

//Assets
//Background image
loadSprite("background", "./images/background.jpg")
//Player
loadSprite("player_up", "./images/player_up.png")
loadSprite("player_down", "./images/player_down.png")
loadSprite("player_left", "./images/player_left.png")
loadSprite("player_right", "./images/player_right.png")
//Walls
loadSprite("fence_x", "./images/top_bottom.png")
loadSprite("fence_y", "./images/left_right.png")
//Cannons
loadSprite("cannon_up_left", "./images/cannon_up_left.png")
loadSprite("cannon_up_right", "./images/cannon_up_right.png")
loadSprite("cannon_bot_right", "./images/cannon_bot_right.png")
loadSprite("cannon_bot_left", "./images/cannon_bot_left.png")
//Obstacles
loadSprite("ball", "./images/ball.png")
loadSprite("eye", "./images/eye.png")
loadSprite("mouth", "./images/mouth.png")

add([sprite("background"), pos(0, 0), layer("background"), stay()])

//Score Text
let score = 0
const scoreText = add([
    text(`Score:${score}`),
    pos(375, 0),
    scale(0.5),
    color(rgb(0, 255, 0)),
    layer("ui"),
    { value: score },
    stay(),
])

//Time Text
let time = 0
const gameTime = add([
    text(`Elapsed:${time}`),
    pos(170, 5),
    scale(0.35),
    color(rgb(0, 100, 100)),
    layer("ui"),
    { value: time },
    stay(),
])

//Alien speed text
let speed = 0
const alienSpeed = add([
    text(`Alien Speed:+${speed}`),
    pos(590, 5),
    scale(0.35),
    color(rgb(255, 0, 0)),
    layer("ui"),
    { value: speed },
    stay(),
])

//Text value getter
function getText(selector, value) {
    switch (selector) {
        case "score":
            scoreText.text = `Score:${value}`
            break
        case "time":
            gameTime.text = `Elapsed:${value}`
            break
        case "speed":
            alienSpeed.text = `Alien Speed:+${value}`
            break
        default:
            break
    }
}

//UI Background
add([
    rect(700, 40),
    pos(150, 0),
    color(rgb(0, 0, 0)),
    stay(),
    layer("ui_background"),
])

//Main scene
scene("main", () => {
    //Last in on top layer
    layers(["background", "canvas", "ui_background", "ui"])

    //Update elapsed time
    loop(1, () => {
        getText("time", time++)
    })

    //Position and firing direction for each cannon
    const cannonLocations = [
        { px: 50, py: 50, dx: 1, dy: 1 },
        { px: 900, py: 50, dx: -1, dy: 1 },
        { px: 900, py: 700, dx: -1, dy: -1 },
        { px: 50, py: 700, dx: 1, dy: -1 },
    ]

    //Spawn a new alien ball
    function spawnBall() {
        let idx = randi(4)

        add([
            sprite("ball"),
            pos(cannonLocations[idx].px, cannonLocations[idx].py),
            layer("canvas"),
            { dir: { x: cannonLocations[idx].dx, y: cannonLocations[idx].dy } },
            area(),
            scale(1),
            "ball",
        ])
    }

    //Player ship
    const player1 = add([
        sprite("player_up"),
        pos(center()),
        layer("canvas"),
        area(),
        solid(),
    ])

    //Default bullet direction
    let bulletDirection = { x: 0, y: -1 }

    //Key down event handlers for player ship
    onKeyDown("left", () => {
        player1.dir = vec2(-1, 0)
        player1.move(-120, 0)
        bulletDirection = { x: -1, y: 0 }
        player1.use(sprite("player_left"))
    })
    onKeyDown("right", () => {
        player1.dir = vec2(1, 0)
        player1.move(120, 0)
        bulletDirection = { x: 1, y: 0 }
        player1.use(sprite("player_right"))
    })
    onKeyDown("up", () => {
        player1.dir = vec2(0, -1)
        player1.move(0, -120)
        bulletDirection = { x: 0, y: -1 }
        player1.use(sprite("player_up"))
    })
    onKeyDown("down", () => {
        player1.dir = vec2(0, 1)
        player1.move(0, 120)
        bulletDirection = { x: 0, y: 1 }
        player1.use(sprite("player_down"))
    })

    //Top wall
    add([
        sprite("fence_x"),
        pos(0, 0),
        area(),
        solid(),
        layer("canvas"),
        "wall",
    ])
    //Bottom Wall
    add([
        sprite("fence_x"),
        pos(0, 750),
        area(),
        solid(),
        layer("canvas"),
        "wall",
    ])
    //Left wall
    add([
        sprite("fence_y"),
        pos(0, 0),
        area(),
        solid(),
        layer("canvas"),
        "wall",
    ])
    //Right wall
    add([
        sprite("fence_y"),
        pos(950, 0),
        area(),
        solid(),
        layer("canvas"),
        "wall",
    ])

    //Mouth
    add([
        sprite("mouth"),
        pos(200, 575),
        area(),
        solid(),
        layer("canvas"),
        "wall",
    ])
    //Upper right eye
    add([
        sprite("eye"),
        pos(650, 150),
        area(),
        solid(),
        layer("canvas"),
        "wall",
    ])
    //Upper left eye
    add([
        sprite("eye"),
        pos(200, 150),
        area(),
        solid(),
        layer("canvas"),
        "wall",
    ])

    //Upper left cannon
    add([
        sprite("cannon_up_left"),
        pos(50, 50),
        area(),
        solid(),
        layer("canvas"),
    ])
    //Upper right cannon
    add([
        sprite("cannon_up_right"),
        pos(900, 50),
        area(),
        solid(),
        layer("canvas"),
    ])
    //Bottom right cannon
    add([
        sprite("cannon_bot_right"),
        pos(900, 700),
        area(),
        solid(),
        layer("canvas"),
    ])
    //Bottom left cannon
    add([
        sprite("cannon_bot_left"),
        pos(50, 700),
        area(),
        solid(),
        layer("canvas"),
    ])

    //Alien ball speed
    let ballSpeed = 100

    //Increase ball speed and update alien speed text every 10 seconds
    loop(10, () => {
        getText("speed", ballSpeed - 100)
        ballSpeed += 20
    })

    //Update ball position every frame to generate movement
    onUpdate("ball", (b) => {
        b.move(b.dir.x * ballSpeed, b.dir.y * ballSpeed)
    })

    //Spawn a new alien ball every 2 seconds from a random cannon
    loop(2, () => {
        spawnBall()
    })

    //Collision event handler for when a ball collides with a wall
    onCollide("ball", "wall", (b, w) => {
        if (
            b.pos.y + b.height - w.pos.y < 5 &&
            b.pos.y + b.height - w.pos.y > -5
        ) {
            console.log("hit top of wall")
            b.dir.y = -b.dir.y
        } else if (
            w.pos.y + w.height - b.pos.y < 5 &&
            w.pos.y + w.height - b.pos.y > -5
        ) {
            console.log("hit bottom of wall")
            b.dir.y = -b.dir.y
        } else if (
            b.pos.x + b.width - w.pos.x < 5 &&
            b.pos.x + b.width - w.pos.x > -5
        ) {
            console.log("hit left side of wall")
            b.dir.x = -b.dir.x
        } else if (
            w.pos.x + w.width - b.pos.x < 5 &&
            w.pos.x + w.width - b.pos.x > -5
        ) {
            console.log("hit right side of wall")
            b.dir.x = -b.dir.x
        } else {
            console.log("Something went wrong!")
        }
    })

    //Default bullet speed and default cooldown status
    let bulletSpeed = 300
    let bulletOnCooldown = false

    //Spawn a bullet shaped and moving per current player direction
    function spawnBullet(directionX, directionY) {
        let shape = directionX == 0 ? { w: 6, l: 10 } : { w: 10, l: 6 }
        add([
            rect(shape.w, shape.l),
            pos(player1.pos.x + 25, player1.pos.y + 25),
            color(rgb(0, 255, 0)),
            area(),
            layer("canvas"),
            "bullet",
            { dir: { x: directionX, y: directionY } },
        ])
    }

    //Key press handler for firing a bullet,
    //with logic to prevent bullet spam via a .5 second cooldown
    onKeyPress("space", () => {
        if (bulletOnCooldown) return
        spawnBullet(bulletDirection.x, bulletDirection.y)
        bulletOnCooldown = true
        wait(0.5, () => {
            bulletOnCooldown = false
        })
    })

    //Update bullet position every frame to generate movement
    onUpdate("bullet", (bullet) => {
        bullet.move(bullet.dir.x * bulletSpeed, bullet.dir.y * bulletSpeed)
    })

    //Collision handler for when a bullet collides with a ball
    onCollide("bullet", "ball", (bul, bal) => {
        destroy(bul)
        destroy(bal)
        getText("score", ++score)
    })

    //Collision handler for when a bullet collides with a wall
    onCollide("bullet", "wall", (bul) => {
        destroy(bul)
    })

    //Collision handler for when player ship collides with a ball
    player1.onCollide("ball", () => {
        go("lost")
    })
})

//Scene transition for a lost round and option to try again
scene("lost", () => {
    layers(["ui_background", "ui"])

    //You died text
    add([text("YOU DIED"), pos(300, 300), color(rgb(255, 0, 0))])

    //Try again text
    add([
        text("Try again?"),
        pos(375, 400),
        color(rgb(0, 255, 0)),
        scale(0.5),
        area(),
        "again",
    ])

    //On click handler for Try again text
    onClick("again", () => {
        ;(score = 0), (time = 0), (speed = 0)
        getText("score", score)
        getText("time", time)
        getText("speed", speed)
        go("main")
    })
})

//Initialize game loop
go("main")
