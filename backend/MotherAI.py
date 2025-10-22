# game_logic.py
import time
import random
def normalize_board(board):
    """
    0,1,2で表現された盤面を " ", "B", "W" に変換
    """
    mapping = {0: " ", 1: "B", 2: "W"}
    return [[mapping[cell] for cell in row] for row in board]


def get_opponent(player):
    
    """
    指定されたプレイヤーの対戦相手を返します。
    """
    if player == 'B':
        return 'W'
    elif player == 'W':
        return 'B'
    return None

def is_valid_move(board, row, col, player):
    """
    指定された座標 (row, col) が、指定されたプレイヤーにとって合法手であるか判定します。
    """

    if not (0 <= row < 8 and 0 <= col < 8) or board[row][col] != ' ':
        return False
        
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0), (1, 1), (1, -1), (-1, 1), (-1, -1)]
    opponent = get_opponent(player)

    for dr, dc in directions:
        r, c = row + dr, col + dc
        
        if 0 <= r < 8 and 0 <= c < 8 and board[r][c] == opponent:
            while 0 <= r < 8 and 0 <= c < 8 and board[r][c] == opponent:
                r, c = r + dr, c + dc
            
            if 0 <= r < 8 and 0 <= c < 8 and board[r][c] == player:
                return True
    return False

def get_valid_moves(board, player):
    """
    現在の盤面で、プレイヤーが石を置けるすべての合法手を見つけます。
    """
    valid_moves = []
    for r in range(8):
        for c in range(8):
            if is_valid_move(board, r, c, player):
                valid_moves.append((r, c))
    return valid_moves

def make_move(board, move, player):
    """
    指定された手を打ち、挟んだ相手の石を裏返し、新しい盤面と裏返した石の数を生成します。
    """
    new_board = [row[:] for row in board]
    r, c = move
    opponent = get_opponent(player)
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0), (1, 1), (1, -1), (-1, 1), (-1, -1)]

    new_board[r][c] = player
    
    flipped_count = 0
    
    for dr, dc in directions:
        row_temp, col_temp = r + dr, c + dc
        to_flip = []
        
        while 0 <= row_temp < 8 and 0 <= col_temp < 8 and new_board[row_temp][col_temp] == opponent:
            to_flip.append((row_temp, col_temp))
            row_temp, col_temp = row_temp + dr, col_temp + dc
        
        if 0 <= row_temp < 8 and 0 <= col_temp < 8 and new_board[row_temp][col_temp] == player:
            for fr, fc in to_flip:
                new_board[fr][fc] = player
                flipped_count += 1
    
    return new_board, flipped_count

def evaluate_board(board, player, flipped_count):
    """
    盤面を評価し、スコアを返します。
    裏返した石の数に高い重みを与えます。
    """
    player_stones = sum(row.count(player) for row in board)
    opponent_stones = sum(row.count(get_opponent(player)) for row in board)
    
    stone_diff_score = (player_stones - opponent_stones) * 2
    
    flip_score = flipped_count * 20
    
    corner_score = 0
    corners = [(0, 0), (0, 7), (7, 0), (7, 7)]
    for r, c in corners:
        if board[r][c] == player:
            corner_score += 10
        elif board[r][c] == get_opponent(player):
            corner_score -= 10
            
    total_score = stone_diff_score + flip_score + corner_score
    return total_score

def find_best_move(board, player):
    """
    現在の盤面で最も良い手を探索し、その座標を返します。
    """
    time.sleep(random.randint(1,2))
    
    valid_moves = get_valid_moves(board, player)

    if not valid_moves:
        return None

    best_move = None
    best_score = -float('inf')

    for move in valid_moves:
        # make_moveがタプルを返すように修正したので、2つの変数で受け取る
        new_board, flipped_count = make_move(board, move, player)
        
        # 評価関数に裏返した石の数を渡す
        score = evaluate_board(new_board, player, flipped_count)

        if score > best_score:
            best_score = score
            best_move = move

    return best_move