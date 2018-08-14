import jinja2
import os
import sys
import argparse
import logging

sys.path.append(os.getcwd())

import deploy.conf as conf

# SERVER_LIST=[
#     'apache2',
# ]

# parser = argparse.ArgumentParser(description='kicad-cn auto deploy tool')

# parser.add_argument('-s', '--server', metavar='server',
#                     type=str, help='server backend', default='apache2')



if __name__ == "__main__":
    # args = parser.parse_args()
    # if args.server not in SERVER_LIST:
    #     logging.critical("server not support")
    # else :
    with open('/etc/apache2/sites-available/kicadcn.conf', 'w') as fp:
        temp = jinja2.Template(open('./deploy/kicadcn-apache2.jinja').read())
        fp.write(temp.render(**conf.apache2))

    os.popen('ln -s /etc/apache2/sites-available/kicadcn.conf /etc/apache2/sites-enabled/kicadcn.conf')

        









    









        



