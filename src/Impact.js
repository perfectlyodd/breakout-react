class Impact {
    static valueInRange(val, min, max) {
        return (val >= min) && (val <= max);
    }
    static isOverlap(missileX, missileY, missileDiameter, obstacleX, obstacleY, obstacleWidth, obstacleHeight) {
        let xOverlap =  Impact.valueInRange(missileX, obstacleX, obstacleX + obstacleWidth) ||
                        Impact.valueInRange(obstacleX, missileX, missileX + missileDiameter);
        let yOverlap =  Impact.valueInRange(missileY, obstacleY, obstacleY + obstacleHeight) || 
                        Impact.valueInRange(obstacleY, missileY, missileY + missileDiameter);
        return xOverlap && yOverlap;
    }

    static isLeft(missileX, missileY, missileDiameter, obstacleX, obstacleY, obstacleWidth, obstacleHeight) {
        return missileX + missileDiameter < (2 * obstacleX + obstacleWidth)/2;
    }

    static isRight(missileX, missileY, missileDiameter, obstacleX, obstacleY, obstacleWidth, obstacleHeight) {
        return missileX > (2 * obstacleX + obstacleWidth)/2;
    }

    static isAbove(missileX, missileY, missileDiameter, obstacleX, obstacleY, obstacleWidth, obstacleHeight) {
        return  missileY + missileDiameter < (2 * obstacleY + obstacleHeight)/2;;
    }

    static isBelow(missileX, missileY, missileDiameter, obstacleX, obstacleY, obstacleWidth, obstacleHeight) {
        return missileY > (2 * obstacleY + obstacleHeight)/2;
    }

    static isBeside(missileX, missileY, missileDiameter, obstacleX, obstacleY, obstacleWidth, obstacleHeight) {
        return obstacleY < missileY + .5 * missileDiameter && missileY + .5 * missileDiameter < obstacleY + obstacleHeight;
    }

    static isOverUnder(missileX, missileY, missileDiameter, obstacleX, obstacleY, obstacleWidth, obstacleHeight) {
        return obstacleX < missileX + .5 * missileDiameter && missileX + .5 * missileDiameter < obstacleX + obstacleWidth;
    }

    static isCorner(missileX, missileY, missileDiameter, obstacleX, obstacleY, obstacleWidth, obstacleHeight) {
        return !Impact.isBeside(missileX, missileY, missileDiameter, obstacleX, obstacleY, obstacleWidth, obstacleHeight) &&
            !Impact.isOverUnder(missileX, missileY, missileDiameter, obstacleX, obstacleY, obstacleWidth, obstacleHeight);
    }
    
    static vxMultiplier(missileX, missileY, missileDiameter, obstacleX, obstacleY, obstacleWidth, obstacleHeight) {
        return Impact.isOverlap(missileX, missileY, missileDiameter, obstacleX, obstacleY, obstacleWidth, obstacleHeight) &&
            (Impact.isBeside(missileX, missileY, missileDiameter, obstacleX, obstacleY, obstacleWidth, obstacleHeight) ||
            Impact.isCorner(missileX, missileY, missileDiameter, obstacleX, obstacleY, obstacleWidth, obstacleHeight)) ?
            -1 : 1;
            
    }
    static vyMultiplier(missileX, missileY, missileDiameter, obstacleX, obstacleY, obstacleWidth, obstacleHeight) {
        return Impact.isOverlap(missileX, missileY, missileDiameter, obstacleX, obstacleY, obstacleWidth, obstacleHeight) &&
            (Impact.isOverUnder(missileX, missileY, missileDiameter, obstacleX, obstacleY, obstacleWidth, obstacleHeight) || 
            Impact.isCorner(missileX, missileY, missileDiameter, obstacleX, obstacleY, obstacleWidth, obstacleHeight)) ?
            -1 : 1;
    }
}

export default Impact;