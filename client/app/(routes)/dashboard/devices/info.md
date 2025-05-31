# Device Control Reference Guide

This document provides information about available functionalities for three different device categories in our system. Each device category has specific functions and status properties that can be monitored or controlled.

## Table of Contents
- [DJ Category (Lighting)](#dj-category-lighting)
- [KTKZQ Category (Climate Control)](#ktkzq-category-ac-control)
- [MC Category (Curtain/Blinds Control)](#mc-category-door/window-lock-control)

## DJ Category (Lighting)

### Functions

| Function Code | Type | Description | Values/Range |
|---------------|------|-------------|--------------|
| `switch_led` | Boolean | Toggle light on/off | true/false |
| `work_mode` | Enum | Set light operation mode | "white", "colour", "scene", "music", "scene_1", "scene_2", "scene_3", "scene_4" |
| `bright_value` | Integer | Set brightness | 25-255 |
| `bright_value_v2` | Integer | Set brightness (v2) | 10-1000 |
| `temp_value` | Integer | Set color temperature | 0-255 |
| `temp_value_v2` | Integer | Set color temperature (v2) | 0-1000 |
| `do_not_disturb` | Boolean | Enable do not disturb mode | true/false |
| `countdown_1` | Integer | Set countdown timer | 0-86400 (seconds) |
| `scene_select` | Enum | Select scene | "1", "2", "3", "4", "5" |
| `switch_health_read` | Boolean | Toggle health reading mode | true/false |
| `read_time` | Integer | Set reading time | 1-60 (minutes) |
| `rest_time` | Integer | Set rest time | 1-60 (minutes) |

*Note: Additional JSON-based functions are available for color data, scene data, and music data control.*

## KTKZQ Category (Climate Control)

### Functions

| Function Code | Type | Description | Values/Range |
|---------------|------|-------------|--------------|
| `switch` | Boolean | Toggle device on/off | true/false |
| `child_lock` | Boolean | Enable child lock | true/false |
| `temp_set` | Integer | Set temperature | 0-40 °C |
| `mode` | Enum | Set operation mode | "hot", "cold", "wet", "wind" |
| `countdown_set` | Enum | Set countdown timer | "cancel", "0_5h", "1h", "1_5h", "2h"... up to "12h" |
| `fan_speed_enum` | Enum | Set fan speed level | "level_1", "level_2", "level_3", "level_4" |
| `windspeed` | Enum | Set wind speed | "1", "2", "3", "4", "5", "6" |

### Status Properties

All function properties plus:
- `temp_current`: Current temperature (-20 to 50 °C)
- `countdown_left`: Remaining countdown time (0-360 minutes)

## MC Category (Curtain/Blinds Control)

### Functions

| Function Code | Type | Description | Values/Range |
|---------------|------|-------------|--------------|
| `countdown_set` | Enum | Set countdown timer | "cancel", "1h", "2h", "3h", "4h" |
| `auto_power` | Boolean | Enable automatic operation | true/false |
| `mode` | Enum | Set operation mode | "morning", "night" |
| `percent_control` | Integer | Set position percentage | 0-100% |
| `anti_theft` | Boolean | Enable anti-theft feature | true/false |
| `charge_switch` | Boolean | Toggle charging | true/false |
| `close_reminder` | Boolean | Enable close reminder | true/false |
| `control` | Enum | Control movement | "open", "stop", "close" |
| `countdown` | Enum | Set countdown | "cancel", "1", "2", "3", "4", "5", "6" |

### Status Properties

All function properties plus:
- `time_total`: Total operation time (0-120000 ms)
- `countdown_left`: Remaining countdown time (0-86400 seconds)
- `percent_state`: Current position (0-100%)
- `residual_electricity`: Battery level (0-100%)
- `status`: Current position status ("opened", "closed")
