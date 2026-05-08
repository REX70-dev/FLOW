import datetime
from typing import Tuple

def calculate_sm2(quality: int, repetitions: int, ease_factor: float, interval: int) -> Tuple[int, float, int]:
    """
    SuperMemo-2 (SM-2) algorithm implementation.
    
    :param quality: 0-5 (0: complete blackout, 5: perfect recall)
    :param repetitions: number of consecutive correct answers
    :param ease_factor: ease factor multiplier
    :param interval: previous interval in days
    :return: (new_repetitions, new_ease_factor, new_interval)
    """
    
    if quality >= 3:
        if repetitions == 0:
            new_interval = 1
        elif repetitions == 1:
            new_interval = 6
        else:
            new_interval = round(interval * ease_factor)
        new_repetitions = repetitions + 1
    else:
        new_repetitions = 0
        new_interval = 1
        
    new_ease_factor = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    
    if new_ease_factor < 1.3:
        new_ease_factor = 1.3
        
    return new_repetitions, new_ease_factor, new_interval
