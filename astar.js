// Manhattan Heuristics
function heuristics(a, b) {
    let dx = a.r - b.r;
    let dy = a.c - b.c;
    dx = Math.abs(dx);
    dy = Math.abs(dy);

    return dx + dy;
}


function node3(i, j) {
    this.r = i;
    this.c = j;

    this.wt = 0;
    this.path = [];

    this.f = 0;
    this.g = 0;
    this.h = 0;
}

// A* Alogorithm
const astar=async(isObstacle, start_i, start_j, end_i, end_j) =>{
    let rows = isObstacle.length;
    let cols = isObstacle[0].length;

    let nodes = new Array(rows);
    let visited = new Array(rows);
    let relaxed = new Array(rows);
    for (let i = 0; i < rows; i++) {
        nodes[i] = new Array(cols);
        visited[i] = new Array(cols);
        relaxed[i] = new Array(cols);
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j<cols; j++) {
            nodes[i][j] = new node3(i, j);
            visited[i][j] = false;
            relaxed[i][j] = false;
        }
    }

    let noOfRelaxedNodes = 1;
    relaxed[start_i][start_j] = true;

    let directions = ['top', 'bottom', 'left', 'right'];
    let diagonalDirections=['right-lower','right-upper','left-lower','left-upper']

    let diagonal = $('#diagonal').is(':checked');
    if(diagonal){
        directions= diagonalDirections.concat(directions);
    }

    while (noOfRelaxedNodes > 0) {

        let m, n, minF = 100;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (relaxed[i][j]) {
                    if (nodes[i][j].f < minF) {
                        m = i;
                        n = j;
                        minF = nodes[i][j].f;
                    }
                }
            }
        }

        if (minF == 100) {
            return [];
        }

        relaxed[m][n] = false;
        noOfRelaxedNodes -= 1;
        visited[m][n] = true;

        


        if (m == end_i && n == end_j) {
            freezeClic=false;
            return nodes[m][n].path;
        }
        if(m!=start_i || n!=start_j){
            document.getElementById('' + m + ',' + n).style.backgroundColor = '#97cafe';
        }

        //Explore all neighbours
        for (let i = 0; i < directions.length; i++) {
            let nr = m;
            let nc = n;
            let direction = directions[i];

            if (direction == 'top') {
                nr -= 1;
            } else if (direction == 'bottom') {
                nr += 1;
            } else if (direction == 'left') {
                nc -= 1;
            } else if (direction == 'right') {
                nc += 1;
            }else if(direction == 'left-upper'){
                nr-=1;
                nc-=1;
            }else if(direction == 'left-lower'){
                nr+=1;
                nc-=1;
            }else if(direction == 'right-upper'){
                nr-=1;
                nc+=1;
            }else if(direction == 'right-lower'){
                nr+=1;
                nc+=1;
            }

            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || isObstacle[nr][nc] == 1 || visited[nr][nc] == true) {
                // Not a valid point
                continue;
            }


            if (relaxed[nr][nc] == true) {
                // if a path has been found to m,n then check the weight and if new path is more shorter than update the path
                if (nodes[nr][nc].f > (nodes[m][n].g + 1 + nodes[nr][nc].h)) {
                    nodes[nr][nc].wt = nodes[m][n].wt + 1;

                    nodes[nr][nc].g = nodes[m][n].g + 1;
                    nodes[nr][nc].f = (nodes[nr][nc].g + nodes[nr][nc].h);

                    nodes[nr][nc].path = [...nodes[m][n].path];
                    nodes[nr][nc].path.push(direction);
                }
            }
            else {
                // if this is the first path found to m,n then update the node's weight and path and also mark it as relaxed

                nodes[nr][nc].wt = nodes[m][n].wt + 1;

                nodes[nr][nc].g = nodes[m][n].g + 1;
                nodes[nr][nc].h = heuristics(nodes[nr][nc],nodes[end_i][end_j]);
                nodes[nr][nc].f = (nodes[nr][nc].g + nodes[nr][nc].h);

                nodes[nr][nc].path = [...nodes[m][n].path];
                nodes[nr][nc].path.push(direction);

                if(nr!=end_i || nc!=end_j){
                    document.getElementById('' + nr + ',' + nc).style.backgroundColor = '#cafafe';
                }
                relaxed[nr][nc] = true;
                noOfRelaxedNodes += 1;
            }

            await waitForSeconds(0.02);

        }


    }
    freezeClic=false;
    return [];





}

