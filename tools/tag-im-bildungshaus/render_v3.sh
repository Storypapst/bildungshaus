#!/bin/bash
# v3 render batch (Fachwand, Cube, cross ventilation, one house). Resumable: skips files that exist.
# Run detached:  setsid nohup ./render_v3.sh > renders/v3_batch.log 2>&1 &
# Writes renders/V3_DONE when finished. Unchanged v2 renders (werkstatt, waschraum becken) are kept.
cd "$(dirname "$0")"
export PYTHONHASHSEED=0
OUT=renders
LOG=$OUT/logs_v3
mkdir -p $OUT $LOG
rm -f $OUT/V3_DONE
skip(){ [ -f "$OUT/$1" ]; }
run(){ echo "$(date +%T) start $*" >> $OUT/v3_status.txt
       python3 rooms.py "$@" --out $OUT > "$LOG/$(echo $* | tr ' -' '__').txt" 2>&1
       echo "$(date +%T) done $? $*" >> $OUT/v3_status.txt; }
ROOMS=("halle 745" "halle 800" "kaufladen" "abholung" "waschraum 1145" "bistro" "aussen" "ausblick")
[ -n "$BH_915" ] && ROOMS+=("halle 915")
# rooms (beauty)
for sv in "${ROOMS[@]}"; do
  set -- $sv; n=$1${2:+_$2}; skip $n.png || run --scene $1 --variant "$2" --res 1600 --samples 40
done
# close-ups: scene variant shot [output name]
for sv in "fachwand - nah fachwand" "halle 745 fenster" "halle 745z fenster" "halle 800 obelisk" "kaufladen - kasse" \
          "abholung - faecher" "abholung - wunsch" "bistro - daumen"; do
  set -- $sv; v=$2; [ "$v" = "-" ] && v=""
  n=${4:-$1${v:+_$v}_$3}; skip $n.png || run --scene $1 --variant "$v" --shot $3 --res 1400 --samples 24
done
# hover masks
for sv in "${ROOMS[@]}"; do
  set -- $sv; n=$1${2:+_$2}; skip ${n}_id.png || run --scene $1 --variant "$2" --res 800 --pass id
done
touch $OUT/V3_DONE
