#!/bin/bash -e

# ================= FUNCTIONS ================= #

res1=$(date +%s.%N)

# Colors
green=`tput setaf 2`
red=`tput setaf 1`
reset=`tput sgr0`

# Terminal Update, Upgrade & Autoremove
function update_terminal {
  sudo apt update && \
  sudo apt upgrade -y && \
  sudo apt autoremove -y
  echo ""
}

# If return value is not 1 then install
function program_to_install {
  echo ""
  echo "Installing Program: $1"
  echo ""

  if $1 == "python"; then # install python
    sudo apt install -y python3
  elif $1 == "node"; then # install nodejs
    curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
    sudo apt install -y nodejs
  elif $1 == "gulp"; then # install gulp-cli
    sudo npm install --global gulp-cli
  elif $1 == "gem"; then # install gem
    sudo apt install -y ruby
    sudo apt install -y ruby-dev
  elif $1 == "bundler"; then # install bundler
    sudo apt update
    sudo apt install -y bundler
  elif $1 == "jekyll"; then # install jekyll
    sudo apt install -y make build-essential
    echo "export GEM_HOME=$HOME/gems" >> ~/.bashrc
    echo "export PATH=$HOME/gems/bin:$PATH" >> ~/.bashrc
    source ~/.bashrc
  fi

  echo ""
  echo "Successfully installed: $1"
  echo ""
}

# return 1 if global command line program installed, else 0 e.g:
#     echo "node: $(program_is_installed node)"
function program_is_installed {
  # set to 1 initially
  local return_=1
  # set to 0 if not found
  type $1 >/dev/null 2>&1 || { local return_=0; }
  # return value
  echo "$return_"
  # Install not found program
  if [ "$return_" -eq "0" ]; then
    program_to_install $1
  fi
}

# If return value is not 1 then install
function npm_package_to_install {
  echo ""
  echo "Installing NPM Package: $1"
  echo ""

  if $1 == "gulp"; then # install gulp
    sudo npm install gulp
  elif $1 == "gulp-concat"; then # install gulp-concat
    sudo npm install gulp-concat
  elif $1 == "gulp-csso"; then # install gulp-csso
    sudo npm install gulp-csso
  elif $1 == "gulp-imagemin"; then # install gulp-imagemin
    sudo npm install gulp-imagemin
  elif $1 == "gulp-plumber"; then # install gulp-plumber
    sudo npm install gulp-plumber
  elif $1 == "gulp-sass"; then # install gulp-sass
    sudo npm install gulp-sass
  elif $1 == "gulp-uglify"; then # install gulp-uglify
    sudo npm install gulp-uglify
  fi

  echo ""
  echo "Successfully installed: $1"
  echo ""
}

# return 1 if local npm package is installed at ./node_modules, else 0 e.g:
#     echo "gulp : $(npm_package_is_installed gulp)"
function npm_package_is_installed {
  # set to 1 initially
  local return_=1
  # set to 0 if not found
  ls node_modules | grep -w $1 >/dev/null 2>&1 || { local return_=0; }
  # return value
  echo "$return_"
  # Install not found package
  if [ "$return_" -eq "0" ]; then
    npm_package_to_install $1
  fi
}

# display a message in red with a cross by it e.g:
#     echo echo_fail "No"
function echo_fail {
  # echo first argument in red, then resets colours back to normal
  printf "${red} ✘ ${reset}"
  echo $1
}

# display a message in green with a tick by it e.g:
#     echo echo_fail "Yes"
function echo_pass {
  # echo first argument in green, then resets colours back to normal
  printf "${green} ✔ ${reset}"
  echo $1
}

# echo pass or fail e.g:
#     echo echo_if 1 "Passed"
#     echo echo_if 0 "Failed"
function echo_if {
  if [ $1 == 1 ]; then
    echo_pass $2
  else
    echo_fail $2
  fi
}

function check_programs {
  # Command-line Programs
  echo ""
  echo "Command Line Programs"
  echo "====================="
  echo "python  : $(echo_if $(program_is_installed python))"
  echo "node    : $(echo_if $(program_is_installed node))"
  echo "gulp    : $(echo_if $(program_is_installed gulp))"
  echo "gem     : $(echo_if $(program_is_installed gem))"
  echo "bundler : $(echo_if $(program_is_installed bundler))"
  echo "jekyll  : $(echo_if $(program_is_installed jekyll))"
  echo ""
}

function check_npm_packages {
  # local npm packages
  echo ""
  echo "Local NPM Packages"
  echo "=================="
  echo "browser-sync  : $(echo_if $(npm_package_is_installed browser-sync))"
  echo "gulp          : $(echo_if $(npm_package_is_installed gulp))"
  echo "gulp-concat   : $(echo_if $(npm_package_is_installed gulp-concat))"
  echo "gulp-csso     : $(echo_if $(npm_package_is_installed gulp-csso))"
  echo "gulp-imagemin : $(echo_if $(npm_package_is_installed gulp-imagemin))"
  echo "gulp-plumber  : $(echo_if $(npm_package_is_installed gulp-plumber))"
  echo "gulp-sass     : $(echo_if $(npm_package_is_installed gulp-sass))"
  echo "gulp-uglify   : $(echo_if $(npm_package_is_installed gulp-uglify))"
  echo ""
}

function check_total_time {
  res2=$(date +%s.%N)
  dt=$(echo "$res2 - $res1" | bc)
  dd=$(echo "$dt/86400" | bc)
  dt2=$(echo "$dt-86400*$dd" | bc)
  dh=$(echo "$dt2/3600" | bc)
  dt3=$(echo "$dt2-3600*$dh" | bc)
  dm=$(echo "$dt3/60" | bc)
  ds=$(echo "$dt3-60*$dm" | bc)

  echo """
   *******************************
  *********************************
  **
  ** ${green} DONE ${reset} in ${ds} s.
  **
  *********************************
   *******************************
  """
}

# =================== START =================== #

update_terminal
check_programs
check_npm_packages
update_terminal
check_total_time
